import {Component, OnInit, NgModule} from '@angular/core';
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
import {SocketService} from './_services/socket/socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SpinnerService ]
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
              private _socketService: SocketService
  ) {
    this.loading = this._spinnerService.getSpinnerState();
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
      this.router.events.subscribe(event => this.modifyHeader(event));
      this.router.events.subscribe(event => this.modifyFooter(event));
    }

  modifyFooter(location) {

   if (location.url === '/app-upload-docs' || location.url === '/onboarding' || location.url === '/workshop/*/edit') {
       this.showFooter = false;
      }
      else {
        this.showFooter = true;
      }
  }

   modifyHeader(location) {
   // alert(location.url)
     if (location.url === '/workshop' ||  location.url === '/' || location.url === '/workshop/*/edit') {
       this.showHeader = false;
      }
      else {
        this.showHeader = true;
      }
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
