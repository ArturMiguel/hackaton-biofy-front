import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  processImage(formData: FormData, thread: string) {
    if (thread) {
      return this.httpClient.post(`${environment.api}/v1/ia-models/images?thread=${thread}`, formData).toPromise();
    } else {
      return this.httpClient.post(`${environment.api}/v1/ia-models/images`, formData).toPromise();
    }
  }

  sendMessage(message: string, thread: string) {
    return this.httpClient.post(`${environment.api}/v1/ia-models/texts`, { message, thread }).toPromise();
  }

  uploadAudio(file: any, thread: string) {
    const formData = new FormData();
    formData.append("file", file);
    return this.httpClient.post(`${environment.api}/v1/ia-models/audios`, formData, {
      headers: {
        thread: thread
      }
    }).toPromise();
  }
}
