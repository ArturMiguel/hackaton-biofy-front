import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { OpenaiService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage | null = null;
  public responseHtml: string = ''
  public showProgress: boolean = false;

  constructor(private openaiService: OpenaiService) { }

  ngOnInit(): void {
  }

  takeAPicture() {
    this.trigger.next();
  }

  imageHandler(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  async processImageButton() {
    const file = this.dataURLtoFile(this.webcamImage?.imageAsDataUrl!, `${new Date().getTime()}.jpeg`)
    this.processImage(file)
  }

  private dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  onSelectFile(event: any) {
    this.processImage(event.files[0])
    console.log(event.files[0])
  }

  async processImage(file: File) {
    this.responseHtml = ''
    this.showProgress = true;
    const formData = new FormData();
    formData.append("file", file);

    const response: any = await this.openaiService.processImage(formData).finally(() => {
      this.showProgress = false;
    });
    this.responseHtml = response!.choices[0].message.content;
  }

}
