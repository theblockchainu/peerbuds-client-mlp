import { Injectable } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'ngx-cookie-service';

import { AppConfig } from '../../app.config';

@Injectable()
export class ProfileService {
  public key = 'userId';
  private userId;

  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router) {
    this.userId = this.getCookieValue(this.key);
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

  public socialProfiles(){
    const socialProfile = [];
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/identities')
        .map((response: Response) => response.json()
        );
    }
  }

  public interestTopics(){
    const interestTopics = [];
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/topics')
        .map((response: Response) => response.json()
        );
    }
  }
}
