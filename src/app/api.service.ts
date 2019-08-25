import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL: string = 'http://api.openweathermap.org/data/2.5/weather';
  appKey = '64dc5671ec31af8ae261915184f2b35c';

  constructor(private http: HttpClient) { }

  getForecast(city:string) {
    return this.http.get(`${this.apiURL}?q=${city}&APPID=${this.appKey}&units=metric`)
  }
}
