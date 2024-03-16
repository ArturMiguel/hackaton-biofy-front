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
}
