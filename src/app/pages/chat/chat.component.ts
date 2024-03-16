import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messageList = [
    {
      "message": "Que tipo de doença pode ser blablabla",
      "type": "USER",
      "thread": "thread_Tzr0tZtYhXUge2GL5PkPrKgE"
    },
    {
      "message": "Ah, isso é uma traça-do-tomateiro! Também conhecida como Tuta absoluta, essa pequena mariposa é uma praga bem chata para os tomateiros. Elas colocam seus ovos nas folhas, e quando as larvas nascem, começam a se alimentar das folhas, caules e frutos, o que pode causar sérios danos às plantas. É importante ficar de olho e tomar medidas para controlar essas pragas, como usar armadilhas, inseticidas naturais ou até mesmo inseticidas químicos, se necessário.",
      "type": "BOT",
      "thread": "thread_Tzr0tZtYhXUge2GL5PkPrKgE"
    },
    {
      "message": "E como combato ela?",
      "type": "USER",
      "thread": "thread_Tzr0tZtYhXUge2GL5PkPrKgE"
    },
    {
      "message": "Existem várias formas de combater a traça-do-tomateiro, algumas mais naturais e outras mais químicas. Aqui estão algumas opções:",
      "type": "BOT",
      "thread": "thread_Tzr0tZtYhXUge2GL5PkPrKgE"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
