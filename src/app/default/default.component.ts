import { Component } from '@angular/core';
import { Router, Params, NavigationStart, ActivatedRoute } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class DefaultComponent {
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilService: CookieUtilsService) {
    if (cookieUtilService.getValue('userId')) {
      this.router.navigate(['home', 'homefeed']);
    } else {

    }

  }

}
