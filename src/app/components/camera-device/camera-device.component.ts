import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage } from 'ngx-webcam';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera-device',
  templateUrl: './camera-device.component.html',
  styleUrls: ['./camera-device.component.scss']
})
export class CameraDeviceComponent implements OnInit {
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage | null = null;

  constructor(
    private ref: DynamicDialogRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  imageHandler(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  takeAPicture() {
    this.trigger.next();
    const file = this.dataURLtoFile(this.webcamImage?.imageAsDataUrl!, `${new Date().getTime()}.jpeg`)
    const decodedData = atob(this.webcamImage?.imageAsBase64!);
    const byteCharacters = new Uint8Array(decodedData.length);
    for (var i = 0; i < decodedData.length; i++) {
        byteCharacters[i] = decodedData.charCodeAt(i);
    }
    const blob = new Blob([byteCharacters], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(blob);

    this.ref.close({ file, url: this.sanitizer.bypassSecurityTrustUrl(imageUrl) });
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
}
