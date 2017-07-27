import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
        , RequestOptionsArgs } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Observable } from "rxjs";

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'angular2-cookie/core';

import { AppConfig } from '../../app.config';

@Injectable()
export class AuthenticationService {

    public key = 'access_token';
    private loggedIn: any;
    isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: Http, private config: AppConfig,
                private _cookieService: CookieService,
                private route: ActivatedRoute,
                public router: Router) {
      // this.loggedIn = !!this.getCookie(this.key);
    }

    /**
    *
    * @returns {Observable<T>}
    */
    isLoggedIn() : Observable<boolean> {
     return this.isLoginSubject.asObservable();
    }

    /**
    *  Login the user then tell all the subscribers about the new status
    */
    login(email: string, password: string) : any {
      // localStorage.setItem('token', 'JWT');
      // this.isLoginSubject.next(true);
      let body = `{"email":"${email}","password":"${password}"}`;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers, withCredentials: true });
      let responseStatus = false;
      return this.http
                 .post(this.config.apiUrl + '/auth/local', body, options)
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
      // return responseStatus;

    }

    /**
    * Log out the user then tell all the subscribers about the new status
    */
    logout() : void {
      localStorage.removeItem('token');
      this.isLoginSubject.next(false);
    }

    /**
     * if we have token the user is loggedIn
     * @returns {boolean}
     */
    private hasToken() : boolean {
      return !!localStorage.getItem('token');
    }
}
