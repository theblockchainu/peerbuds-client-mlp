import { Injectable, Output, EventEmitter } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'ngx-cookie-service';

import { AppConfig } from '../../app.config';
import { RequestHeaderService } from '../requestHeader/request-header.service';
import {SocketService} from '../socket/socket.service';

@Injectable()
export class AuthenticationService {
  @Output()
  getLoggedInUser: EventEmitter<any> = new EventEmitter();

  public key = 'access_token';
  private options;
  private userId;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: Http, private config: AppConfig,
        private _cookieService: CookieService,
        private route: ActivatedRoute,
        public router: Router,
        public _requestHeaderService: RequestHeaderService,
        private _socketService: SocketService
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
    const body = `{"email":"${email}","password":"${password}"}`;
    return this.http
      .post(this.config.apiUrl + '/auth/local', body, this.options)
      .map((response: Response) => {
      //if res code is xxx and response "error"
        // login successful if there's a jwt token in the response
        const user = response.json();
        if (user && user.access_token) {
          this.isLoginSubject.next(true);
          this.getLoggedInUser.emit(user.userId);
          this._socketService.addUser(user.userId);
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
      this.http.get(this.config.apiUrl + '/auth/logout', this.options)
        .map((res: Response) => {
          console.log('Logged out from server');
          this.removeCookie(this.key);
          this.removeCookie('userId');
          this.removeCookie('accountApproved');
          this.isLoginSubject.next(false);
          this.getLoggedInUser.emit(0);
          this.router.navigate(['/']);
        }).subscribe();
    }
  }

  public broadcastNewUserId(userId) {
      this.getLoggedInUser.emit(userId);
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!this.getCookie(this.key);
  }

  sendForgotPwdMail(email): any {
    const body = `{"email":"${email}"}`;
    return this.http
      .post(this.config.apiUrl + '/api/peers/forgotPassword?em=' + email, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  sendEmailSubscriptions(email): any {
    const body = `{"email":"${email}"}`;
    return this.http
      .post(this.config.apiUrl + '/api/emailSubscriptions?em=' + email, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  resetpwd(email: string, password: string): any {
    const body = `{"email":"${email}","password":"${password}"}`;
    return this.http
      .post(this.config.apiUrl + '/api/peers/reset', body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }
  createGuestContacts(first_name, last_name, email, subject, message): any {
    const body = `{"first_name":"${first_name}","last_name":"${last_name}","email":"${email}","subject":"${subject}","message":"${message}"}`;
      return this.http
      .post(this.config.apiUrl + '/api/guestContacts?em=' + email, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
    }
}
