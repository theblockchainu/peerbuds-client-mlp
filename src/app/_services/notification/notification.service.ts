import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {AppConfig} from '../../app.config';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestHeaderService} from '../requestHeader/request-header.service';

@Injectable()
export class NotificationService {

  public key = 'userId';
  private userId;
  public options;
  public now: Date;

  constructor(private http: Http,
              private config: AppConfig,
              private _cookieService: CookieService,
              private route: ActivatedRoute,
              public router: Router,
              private requestHeaderService: RequestHeaderService) {
      this.userId = this.getCookieValue(this.key);
      this.options = requestHeaderService.getOptions();
      this.now = new Date();
  }

  private getCookieValue(key: string) {
      const cookie = this._cookieService.get(key);
      if (cookie) {
          const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
          this.userId = cookieValue[1];
      }
      return this.userId;
  }

  public getNotifications(options: any, cb) {
      if (this.userId) {
          this.http
              .get(this.config.apiUrl + '/api/peers/' + this.userId + '/notifications?' + 'filter=' + options)
              .map((response) => {
                  console.log(response.json());
                  cb(null, response.json());
              }, (err) => {
                  cb(err);
              }).subscribe();
      }
  }

  public updateNotification(body: any, cb) {
      if (this.userId) {
          this.http
              .patch(this.config.apiUrl + '/api/notifications/' + body.id, body, this.options)
              .map((response) => {
                  console.log(response.json());
                  cb(null, response.json());
              }, (err) => {
                  cb(err);
              }).subscribe();
      }
  }

}
