import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { Http, Response } from '@angular/http';
@Injectable()
export class TimezonePickerService {

  constructor(private http: Http, private config: AppConfig) {
  }

  public getTimezones() {
    return this.http.get(this.config.apiUrl + '/api/timezones')
      .map((response: Response) => {
        return response.json();
      });
  }

}
