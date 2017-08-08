import { Injectable } from '@angular/core';

import {
  Http, Headers, Response, RequestOptions
} from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../app.config';

@Injectable()
export class RequestHeaderService {
  public key = 'userId';
  private userId;

  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService) {
      this.userId = this.getCookieValue(this.key);
     }
  getOptions() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }
  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  public getProfile() {
    const profile = {};
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/profile')
        .map((response: Response) => response.json()
        );
    }
  }

}
