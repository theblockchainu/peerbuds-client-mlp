import { Injectable } from '@angular/core';
import {
  Http
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { CookieUtilsService } from '../cookieUtils/cookie-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestHeaderService } from '../requestHeader/request-header.service';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class TopicService {
  private userId;
  public options;
  constructor(
    private http: Http, private config: AppConfig,
    private _cookieUtilsService: CookieUtilsService,
    public router: Router,
    private requestHeaderService: RequestHeaderService,
    private route: ActivatedRoute,
  ) {
    this.userId = this._cookieUtilsService.getValue('userId');
    this.options = requestHeaderService.getOptions();
  }

  public getTopics(query?: any): Observable<any> {
    return this.http.get(this.config.apiUrl + '/api/topics?filter=' + JSON.stringify(query))
      .map(res => res.json() || []);
  }

  public requestNewTopic(topic: string): Observable<any> {
    const body = {
      name: topic,
      type: 'user'
    }
    return this.http.post(this.config.apiUrl + '/api/requestedtopics/request-topic', body, this.options)
      .map(res => res.json());
  }

}
