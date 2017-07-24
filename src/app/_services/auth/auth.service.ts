import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthService {
  isLoggedIn = false;
  key = 'access_token';

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private _cookieService: CookieService) {
    this.isLoggedIn = !!this.getCookie(this.key);
  }

  getCookie(key: string): any {
    return this._cookieService.get(key);
  }

  login(): void {
    let userToken = this.getCookie('access_token');
    let userId = this.getCookie('userId');
    if (userToken && userId) {
        // logged in so return true
        this.isLoggedIn = true;
    }
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
