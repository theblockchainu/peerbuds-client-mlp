import { Injectable } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Observable } from "rxjs";

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'ngx-cookie-service';

import { AppConfig } from '../../app.config';
import {RequestHeaderService} from "../requestHeader/request-header.service";

@Injectable()
export class AuthenticationService {

  public key = 'access_token';
  private options;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: Http, private config: AppConfig,
        private _cookieService: CookieService,
        private route: ActivatedRoute,
        public router: Router,
        public _requestHeaderService: RequestHeaderService
  ) {
      this.options = this._requestHeaderService.getOptions();
  }

  /**
  *
  * @returns {Observable<T>}
  */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  public getCookie(key: string) {
    return this._cookieService.get(key);
  }

  public setCookie(key: string, value: string) {
    this._cookieService.set(key, value);
  }

  public removeCookie(key: string) {
    this._cookieService.delete(key);
  }

  /**
  *  Login the user then tell all the subscribers about the new status
  */
  login(email: string, password: string): any {
    // localStorage.setItem('token', 'JWT');
    // this.isLoginSubject.next(true);
    let body = `{"email":"${email}","password":"${password}"}`;
    return this.http
      .post(this.config.apiUrl + '/auth/local', body, this.options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json();
        if (user && user.access_token) {
          this.isLoginSubject.next(true);
          // responseStatus = true;
        }
      }, (err) => {
        console.log('Error: ' + err);
      });
  }

  /**
  * Log out the user then tell all the subscribers about the new status
  */
  logout(): void {
    if (this.getCookie(this.key)) {
      debugger;
      this.http.get(this.config.apiUrl + '/auth/logout', this.options)
        .map((res: Response) => {
          debugger;
          console.log('Logged out from server');
          this.removeCookie(this.key);
          this.removeCookie('userId');
          this.isLoginSubject.next(false);
          this.router.navigate(['/']);
        }).subscribe();
    }
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!this.getCookie(this.key);
  }
}