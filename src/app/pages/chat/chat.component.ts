import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CameraDeviceComponent } from 'src/app/components/camera-device/camera-device.component';
import SweetAlert from 'src/app/libs/SweetAlert';
import { OpenaiService } from 'src/app/services/openai.service';

export enum EMediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE"
}

export enum ETypeMessage {
  USER = "USER",
  BOT = "BOT"
}

export interface IMessage {
  message: any;
  type: ETypeMessage;
  thread: string,
  mediaType: EMediaType
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DialogService]
})
export class ChatComponent implements OnInit {
  public messageList: IMessage[] = [
    {
      "message": "Olá, bem-vindo(a) ao IA.GRO. Em que posso ajudar?",
      "type": ETypeMessage.BOT,
      "thread": "",
      "mediaType": EMediaType.TEXT
    },
  ]
  public message = "";
  public thread = "";
  public isSubmiting = false;
  public items: MenuItem[] = [
    {
      label: 'Câmera',
      icon: 'pi pi-camera',
      command: () => {
        this.openCameraDevice()
      }
    },
    {
      label: 'Galeria',
      icon: 'pi pi-th-large',
      command: () => {
        this.inputFile!.nativeElement.click();
      }
    }
  ]

  // Áudio
  public isRecordingAudio = false;
  public isTranscriptingAudio = false;
  public audioRecorder: any = null;

  @ViewChild('inputFile') inputFile: ElementRef | undefined;

  constructor(
    private openService: OpenaiService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.message.length) {
      this.messageList.push({
        message: this.message,
        thread: this.thread,
        type: ETypeMessage.USER,
        mediaType: EMediaType.TEXT
      })
      this.scrollChatToEnd();

      this.isSubmiting = true;

      this.openService.sendMessage(this.message, this.thread).then((response: any) => {
        this.messageList.push(response.lastMessage);
        this.thread = response.thread;
        this.message = "";
        console.log(response);
      }).catch((error: any) => {
        SweetAlert.error("", error.error.message);
      }).finally(() => {
        this.cdr.detectChanges();
        this.isSubmiting = false;
        this.scrollChatToEnd();
      })
    } else {
      SweetAlert.info("", "Informe a mensagem");
    }
  }

  private scrollChatToEnd() {
    setTimeout(() => {
      const elment: any = document.getElementById("chat-message-list");
      elment.scroll({ top: elment.scrollHeight, behavior: "smooth" });
      this.cdr.detectChanges();
    }, 200)
  }

  public openCameraDevice() {
    const ref = this.dialogService.open(CameraDeviceComponent, {
      height: '90vh',
      width: '80%'
    })

    ref.onClose.subscribe((event: { file: File, url: string }) => {
      if (event) {
        this.handleProcessingImage(event.file, event.url)
      }
    })
  }

  private handleProcessingImage(file: File, url: string) {
    this.messageList.push({
      message: url,
      thread: this.thread,
      mediaType: EMediaType.IMAGE,
      type: ETypeMessage.USER
    })
    this.scrollChatToEnd();
    this.processImage(file);
  }

  handleInputFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Sanitizar a URL para torná-la segura
      const url: any = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
      this.handleProcessingImage(file, url)
    };
    reader.readAsDataURL(file);
  }

  private async processImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    this.isSubmiting = true;

    this.openService.processImage(formData, this.thread).then((response: any) => {
      this.thread = response.thread;
      this.messageList.push({
        message: response.content,
        mediaType: EMediaType.TEXT,
        thread: "",
        type: ETypeMessage.BOT
      })
      this.scrollChatToEnd();
    }).finally(() => {
      this.isSubmiting = false;
    });
  }

  public async startAudioRecording() {
    this.audioRecorder = await this.recordAudio();
    this.audioRecorder.start();
  }

  public async stopAudioRecording() {
    const { audioBlob } = await this.audioRecorder.stop();
      try {
        // blob e file são praticamente a mesma coisa, o blob não tem as propriedades "lastModifiedDate" e "name"
        audioBlob.lastModifiedDate = new Date();
        audioBlob.name = "audio.opus";

        this.isTranscriptingAudio = true;

        this.openService.uploadAudio(audioBlob, this.thread).then(async (response: any) => {
          this.messageList.push(response.transcription);
          this.thread = response.threadId;

          this.isTranscriptingAudio = false;
          this.isSubmiting = true;

          try {
            const res: any = await this.openService.sendMessage(response.transcription.message, this.thread);
            this.messageList.push(res.lastMessage);
          } catch (error: any) {
            SweetAlert.error("", error.error.message);  
          }
        }).catch(err => {
          SweetAlert.error("", err.error.message);
        }).finally(() => {
          this.isSubmiting = false;
        });
      } catch (err: any) {
        SweetAlert.error("", err.error.message);
      }
  }

  public recordAudio(): any {
    const t = this;

    return new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: any[] = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      function start() {
        t.isRecordingAudio = true;
        return mediaRecorder.start();
      }

      async function stop() {
        t.isRecordingAudio = false;

        return new Promise(async resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, {
              type: "audio/ogg"
            });

            stream.getTracks().forEach(track => track.stop()); // Encerra as tracks de áudio pois continuam ativas mesmo após o encerramento da gravação.

            resolve({ audioBlob });
          })

          mediaRecorder.stop();
        })
      }

      resolve({ start, stop })
    })
  }
}
