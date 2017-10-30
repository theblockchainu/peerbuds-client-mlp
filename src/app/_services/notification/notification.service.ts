import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {AppConfig} from '../../app.config';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestHeaderService} from '../requestHeader/request-header.service';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable()
export class NotificationService {

  public key = 'userId';
  public options;
  public now: Date;

  constructor(private http: Http,
              private config: AppConfig,
              private _cookieService: CookieService,
              private route: ActivatedRoute,
              public router: Router,
              private authService: AuthenticationService,
              private requestHeaderService: RequestHeaderService) {
      this.options = requestHeaderService.getOptions();
      this.now = new Date();
  }

  public getNotifications(userId, options: any, cb) {
      if (userId) {
          this.http
              .get(this.config.apiUrl + '/api/peers/' + userId + '/notifications?' + 'filter=' + options)
              .map((response) => {
                  console.log(response.json());
                  cb(null, response.json());
              }, (err) => {
                  cb(err);
              }).subscribe();
      }
  }

  public updateNotification(userId, body: any, cb) {
      if (userId) {
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
