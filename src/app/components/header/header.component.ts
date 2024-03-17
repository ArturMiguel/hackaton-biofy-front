import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public loggedUser: any = {};
  public weatherInfo: any = null;
  public weatherError: any = null;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.getWeatherInfo();
  }

  private async getWeatherInfo() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        this.weatherInfo = await this.weatherService.getWeather(latitude.toString(), longitude.toString());
      } catch (error: any) {
        this.weatherError = error.message;
      }
    }, (error) => {
      this.weatherError = error.message;
    });
  }

  public newChat() {
    window.location.reload();
  }
}
