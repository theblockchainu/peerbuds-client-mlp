import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
        , RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'angular2-cookie/core';

import { AppConfig } from '../../app.config';

@Injectable()
export class AuthenticationService {

    public key = 'access_token';
    private loggedIn = false;

    constructor(private http: Http, private config: AppConfig,
                private _cookieService: CookieService,
                private route: ActivatedRoute,
                public router: Router) {
      this.loggedIn = !!this.getCookie(this.key);
    }

    public getCookie(key: string) {
      return this._cookieService.get(key);
    }

    public setCookie(key: string, value: string) {
      this._cookieService.put(key, value);
    }

    public removeCookie(key: string) {
      this._cookieService.remove(key);
    }

    public login(username: string, password: string) {
      let body = `{"username":"${username}","password":"${password}"}`;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers, withCredentials: true });
      return this.http
                 .post(this.config.apiUrl + '/auth/local', body, options)
                 .map((response: Response) => {
                   // login successful if there's a jwt token in the response
                   let user = response.json();
                   if (user && user.access_token) {
                        // Set Cookie
                        /* if(!this.getCookie("access_token"))
                        {
                          console.log(this.getCookie("access_token"));
                          this.setCookie("access_token", user.access_token);
                        }
                        if(!this.getCookie("userId")){
                          console.log(this.getCookie("userId"));
                          this.setCookie("userId", user.userId);
                        }*/
                   }
                 }, (err) => {
                     console.log('Error: ' + err);
           });

      /* return this.http.post(this.config.apiUrl + '/auth/local',
                                { username: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();

                if (user && user.access_token) {

                }
            });*/
    }

    public signup(provider: string) {
        return this.http.get(this.config.apiUrl + '/auth/' + provider)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.access_token) {
                    // Set Cookie
                    this.setCookie(this.key, user.access_token);
                }
            });
    }

    public register(username: string, password: string, email: string
                  , returnUrl: string) {
        let body = `{"username":"${username}","password":"${password}"
                    ,"email":"${email}"}`;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        return this.http
                   .post(this.config.apiUrl + '/signup?returnTo=http://localhost:9090' + returnUrl, body, options)
                   .map((response: Response) => {
                     // login successful if there's a jwt token in the response
                     let user = response.json();
                     // console.log(user);
                     if (user && user.access_token) {
                         // Set Cookie
                         // this.setCookie("access_token", user.access_token);
                         // this.setCookie("userId", user.userId);
                     }
                   }, (err) => {
                       console.log('Error: ' + err);
             });
        /* return this.http.post(this.config.apiUrl + '/signup',
            { username: username, password: password, email: email })
            .map((response: Response) => {
                debugger;
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.access_token) {
                    // Set Cookie
                    // this.setCookie(this.key, user.access_token);
                }
            });*/
    }

    public logout() {
        if (this.getCookie(this.key)) {
            this.http.get(this.config.apiUrl + '/auth/logout', {})
                .map((res: Response) => {
                    console.log('Logged out from server');
                    this.removeCookie(this.key);
                    this.removeCookie('userId');
                    this.loggedIn = false;
                    this.router.navigate(['/login']);
                }).subscribe();
        }

        /* let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('access_token', this.getCookie(this.key));
        let options = new RequestOptions({ headers: headers, withCredentials: true });
            this.http
                   .get(this.config.apiUrl + '/auth/logout', options)
                   .map((response: Response) => {
                       this.removeCookie(this.key);
                       this.removeCookie('userId');
                       this.router.navigate(['/login']);
                     }
                   }, (err) => {
                       console.log('Error: ' + err);
             });*/
    }

    public isLoggedIn() {
        return this.loggedIn;
    }
}
