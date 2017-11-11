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
import { AuthenticationService } from '../authentication/authentication.service';
import { CookieUtilsService } from '../cookieUtils/cookie-utils.service';
@Injectable()
export class PaymentService {
  public key = 'userId';
  private options;

  constructor(private http: Http,
    private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthenticationService,
    public _requestHeaderService: RequestHeaderService,
    private _cookieUtilsService: CookieUtilsService
  ) {
    this.options = this._requestHeaderService.getOptions();
  }

  makePayment(userId, customerId: any, body: any) {
    if (userId) {
      return this.http.post(this.config.apiUrl + '/api/create-source/' + customerId, body, this.options);
    }
  }

  createSource(userId, customerId: any, body: any) {
    if (userId) {
      return this.http.post(this.config.apiUrl + '/api/transactions/create-source/' + customerId, body, this.options);
    }
  }

  createCharge(userId, collectionId: any, body: any) {
    if (userId) {
      return this.http.post(this.config.apiUrl + '/api/transactions/create-charge/collection/' + collectionId, body, this.options);
    }
  }

  listAllCards(userId, customerId: any) {
    if (userId) {
      return this.http.get(this.config.apiUrl + '/api/transactions/list-all-cards/' + customerId, this.options);
    }
  }

  deleteCard(userId, customerId: string, cardId: string) {
    if (userId) {
      return this.http.delete(this.config.apiUrl + '/api/transactions/delete-card/' + customerId + '/' + cardId, this.options);
    }
  }

  public getCollectionDetails(id: string) {
    const filter = `{"include": [{"owners":"profiles"},"calendars",{"contents":"schedules"}]}`;
    return this.http
      .get(this.config.apiUrl + '/api/collections/' + id + '?filter=' + filter)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public createConnectedAccount(authcode: string, error?: any, errDescription?: any): Observable<any> {
    if (error) {
      return this.http.get(this.config.apiUrl + '/api/payoutaccs/create-connected-account?error=' + error + '&errorDesc=' + errDescription, this.options).map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
    } else {
      console.log(authcode);

      return this.http.get(this.config.apiUrl + '/api/payoutaccs/create-connected-account?authCode=' + authcode, this.options).map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
    }
  }
  /**
   * retrieveConnectedAccount
   */
  public retrieveConnectedAccount(): Observable<any> {
    return this.http.get(this.config.apiUrl + '/api/payoutaccs/retrieve-connected-accounts', this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }
  /**
   * createLoginLink
   */
  public createLoginLink(accountId: string): Observable<any> {
    return this.http.get(this.config.apiUrl + '/api/payoutaccs/create-login-link?accountId=' + accountId, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  /**
   * getTransactions
   */
  public getTransactions(userId, filter?: any): Observable<any> {
    if (filter) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/transactions?filter=' + JSON.stringify(filter), this.options)
        .map((response: Response) => response.json(), (err) => {
          console.log('Error: ' + err);
        });
    } else {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/transactions', this.options)
        .map((response: Response) => response.json(), (err) => {
          console.log('Error: ' + err);
        });
    }
  }

  /**
   * convertCurrency
   */
  public convertCurrency(amount: number, from: string) {
    const body = {
      'from': from,
      'to': this._cookieUtilsService.getValue('currency'),
      'amount': amount
    };
    return this.http.post(this.config.apiUrl + '/convertCurrency', body, this.options)
      .map((response: Response) => {
        const res = response.json();
        if (res.success) {
          return {
            amount: res,
            currency: this._cookieUtilsService.getValue('currency')
          };
        } else {
          return {
            amount: amount,
            currency: from
          };
        }

      }, (err) => {
        return {
          amount: amount,
          currency: from
        };
      });
  }

}
