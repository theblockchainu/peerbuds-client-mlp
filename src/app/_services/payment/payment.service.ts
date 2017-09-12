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
import {RequestHeaderService} from '../requestHeader/request-header.service';

@Injectable()
export class PaymentService {
  public key = 'userId';
  private userId;
  private options;

  constructor(private http: Http,
              private config: AppConfig,
              private _cookieService: CookieService,
              private route: ActivatedRoute,
              public router: Router,
              public _requestHeaderService: RequestHeaderService
  ) {
    this.userId = this.getCookieValue(this.key);
    this.options = this._requestHeaderService.getOptions();
   }

   private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  makePayment(customerId: any, body: any) {
     if (this.userId) {
      return this.http.post(this.config.apiUrl + '/api/create-source/' + customerId, body, this.options);
    }
  }

  createSource(customerId: any, body: any ) {
    if (this.userId) {
      return this.http.post(this.config.apiUrl + '/api/transactions/create-source/' + customerId, body, this.options);
    }
  }

  createCharge(collectionId: any, body: any) {
    if (this.userId) {
      return this.http.post(this.config.apiUrl + '/api/transactions/create-charge/collection/'+ collectionId, body, this.options);
    }
  }

  listAllCards(customerId: any) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/transactions/list-all-cards/' + customerId, null);
    }
  }

}
