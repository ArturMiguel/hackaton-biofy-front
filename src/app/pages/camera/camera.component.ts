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

  processImage() {

  }
}
