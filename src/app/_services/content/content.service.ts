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
export class ContentService {

  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router) { }

  public getTopics() {
    return this.http.get(this.config.apiUrl + '/api/topics')
                    .map((response: Response) => response.json(), (err) => {
                        console.log('Error: ' + err);
                    });

  }

}
