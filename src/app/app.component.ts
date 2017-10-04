import {Component, OnInit} from '@angular/core';
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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SpinnerService ]
})
export class AppComponent {
  title = 'app';
  public activePath = 'home';

  // Sets initial value to true to show loading spinner on first load
  loading;

  constructor(private router: Router,
              private _spinnerService: SpinnerService) {
    this.loading = this._spinnerService.getSpinnerState();
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
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