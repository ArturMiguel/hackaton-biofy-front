import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { WebcamModule } from 'ngx-webcam';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CameraDeviceComponent } from './components/camera-device/camera-device.component';
import { MenuModule } from 'primeng/menu';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChatComponent,
    ChatMessageComponent,
    CameraDeviceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    WebcamModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ProgressSpinnerModule,
    FormsModule,
    DynamicDialogModule,
    MenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
