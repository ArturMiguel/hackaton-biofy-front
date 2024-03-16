import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import SweetAlert from 'src/app/libs/SweetAlert';
import { OpenaiService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messageList = [
    {
      "message": "Olá, bem-vindo(a) ao IA.GRO. Em que posso ajudar?",
      "type": "BOT",
      "thread": ""
    },
  ]
  public message = "";
  public thread = "";
  public isSubmiting = false;

  // Áudio
  public isRecordingAudio = false;
  public isTranscriptingAudio = false;
  public audioRecorder: any = null;

  constructor(
    private openService: OpenaiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (this.message.length) {
      this.messageList.push({
        message: this.message,
        thread: this.thread,
        type: "USER"
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
    const elment: any = document.getElementById("chat-message-list");
    elment.scroll({ top: elment.scrollHeight, behavior: "smooth" });
    this.cdr.detectChanges();
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
