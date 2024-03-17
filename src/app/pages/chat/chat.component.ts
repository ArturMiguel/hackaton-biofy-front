import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private openService: OpenaiService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
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
        this.messageList.push({
          message: event.url,
          thread: this.thread,
          mediaType: EMediaType.IMAGE,
          type: ETypeMessage.USER
        })
        this.scrollChatToEnd();
        this.processImage(event.file);
      }
    })
  }

  private async processImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    this.isSubmiting = true;

    this.openService.processImage(formData).then((response: any) => {
      this.messageList.push({
        message: response!.choices[0].message.content,
        mediaType: EMediaType.TEXT,
        thread: "",
        type: ETypeMessage.BOT
      })
      this.scrollChatToEnd();
    }).finally(() => {
      this.isSubmiting = false;
    });
  }
}
