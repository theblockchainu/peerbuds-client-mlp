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

import { RequestHeaderService } from '../requestHeader/request-header.service';

@Injectable()
export class ContentService {

  public options;

  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router,
    private requestHeaderService: RequestHeaderService) {
      this.options = requestHeaderService.getOptions();
    }

  public getEvents(userId: string) {
    return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/eventCalendar', this.options)
                    .map((response: Response) => response.json(), (err) => {
                        console.log('Error: ' + err);
                    });

  }

  public addNewLanguage(name: string) {
    const body = {
      'name': name,
      'code': name
    };
    return this.http.post(this.config.apiUrl + '/api/languages', body, this.options)
                    .map((response: Response) => response.json(), (err) => {
                      console.log('Error: ' + err);
                     });
  }
}
