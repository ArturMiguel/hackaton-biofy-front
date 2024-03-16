import { Component, OnInit } from '@angular/core';
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
      "message": "Olá, bem-vindo(a) ao IA.AGRO. Em que posso ajudar?",
      "type": "BOT",
      "thread": ""
    },
  ]
  public message = "";

  constructor(
    private openService: OpenaiService
  ) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.openService.sendMessage(this.message).then((response) => {
      console.log(response);
    }).catch((error: any) => {
      SweetAlert.error("", error.error.message);
    })
  }
}
