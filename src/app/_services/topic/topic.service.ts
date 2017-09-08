import { Injectable } from '@angular/core';
import {
  Http
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { CookieUtilsService } from '../cookieUtils/cookie-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestHeaderService } from '../requestHeader/request-header.service';




@Injectable()
export class TopicService {
  private userId;
  public options;
  constructor(
    private http: Http, private config: AppConfig,
    private _cookieUtilsService: CookieUtilsService,
    private route: ActivatedRoute,
    public router: Router,
    private requestHeaderService: RequestHeaderService
  ) {
    this.userId = this._cookieUtilsService.getValue('userId');
    this.options = requestHeaderService.getOptions();
  }

  public getTopics(query?: any) {
    return this.http.get(this.config.apiUrl + '/api/topics?filter=' + JSON.stringify(query));
  }

}
