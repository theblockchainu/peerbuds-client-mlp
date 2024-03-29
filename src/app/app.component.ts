import { Component, OnInit, NgModule } from '@angular/core';
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import { SpinnerService } from './_services/spinner/spinner.service';
import { SocketService } from './_services/socket/socket.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './_services/authentication/authentication.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SpinnerService]
})
export class AppComponent implements OnInit {
  title = 'app';
  public activePath = 'home';
  showHeader = true;
  showFooter = true;

  // Sets initial value to true to show loading spinner on first load
  loading;

  constructor(private router: Router,
    private _spinnerService: SpinnerService,
    private _socketService: SocketService,
    private _cookieService: CookieService,
    private _authService: AuthenticationService,
    private titleService: Title
  ) {
    this.loading = this._spinnerService.getSpinnerState();
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => this.modifyHeader(event));
    this.router.events.subscribe(event => this.modifyFooter(event));
    this.setTitle('Peerbuds');

  }

  modifyFooter(location) {
    this.showFooter = !(location.url === '/app-upload-docs' || location.url === '/onboarding' || /^\/workshop\/.*\/edit\/./.test(location.url) || /^\/experience\/.*\/edit\/./.test(location.url) || /^\/session\/.*\/edit\/./.test(location.url));
  }

  modifyHeader(location) {
    this.showHeader = !(/^\/workshop\/.*\/edit\/./.test(location.url) || /^\/experience\/.*\/edit\/./.test(location.url) || /^\/session\/.*\/edit\/./.test(location.url) || /^\/error/.test(location.url));
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this._spinnerService.setSpinnerState(true);
      this.loading = this._spinnerService.getSpinnerState();
    }
    if (event instanceof NavigationEnd) {
      this._spinnerService.setSpinnerState(false);
      this.loading = this._spinnerService.getSpinnerState();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._spinnerService.setSpinnerState(false);
      this.loading = this._spinnerService.getSpinnerState();
    }
    if (event instanceof NavigationError) {
      this._spinnerService.setSpinnerState(false);
      this.loading = this._spinnerService.getSpinnerState();
    }
  }
}
