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

  processImage(formData: FormData) {
    return this.httpClient.post(`${environment.api}/v1/ia-models/images`, formData).toPromise();
  }

  sendMessage(message: string) {
    return this.httpClient.post(`${environment.api}/v1/ia-models/text`, { message }).toPromise();
  }
}
