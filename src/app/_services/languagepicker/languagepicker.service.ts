import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions
        , RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { AppConfig } from '../../app.config';

@Injectable()
export class LanguagePickerService {

    constructor(private http: Http, private config: AppConfig
          , private route: ActivatedRoute, public router: Router) {
          }

    public getLanguages() {
          return this.http.get('assets/languages.json')
              .map((response: Response) => {
                return response.json();
              });
    }

}
