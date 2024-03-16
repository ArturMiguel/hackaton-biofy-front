import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient
  ) { }

  public getWeather(latitude: string, lontitude: string) {
    const params = new URLSearchParams({
      latitude: latitude,
      longitude: lontitude
    })
    return this.http.get(`${environment.api}/api/v1/weathers?${params.toString()}`).toPromise();
  }
}
