import { Component, Input, OnInit } from '@angular/core';
import { EMediaType } from 'src/app/pages/chat/chat.component';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() type: string = "";
  @Input() message: string = "";
  @Input() mediaType: string = "";
  @Input() thread: string = "";

  constructor() { }

  ngOnInit(): void {
  }
}
