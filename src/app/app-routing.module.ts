import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  {
    path: "chat",
    component: ChatComponent
  },
  {
    path: "**",
    redirectTo: "chat"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
