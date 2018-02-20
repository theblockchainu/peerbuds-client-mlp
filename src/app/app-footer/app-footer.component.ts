import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { CurrencypickerService } from '../_services/currencypicker/currencypicker.service';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {

  public isVisible = true;
  public activePage = '';
  isLoggedIn: Observable<boolean>;
  loggedIn: boolean;
  public selectedCurrency = 'usd';
  public availableCurrencies: Array<any>;

  constructor(
    public authService: AuthenticationService,
    public activatedRoute: ActivatedRoute,
    private _cookieUtilsService: CookieUtilsService,
    private _currencypickerService: CurrencypickerService
  ) {
    this.isLoggedIn = authService.isLoggedIn();
    authService.isLoggedIn().subscribe((res) => {
      this.loggedIn = res;
    });
  }
  ngOnInit() {
    this._currencypickerService.getCurrencies().subscribe(res => {
      console.log(res);
      this.availableCurrencies = res;
    });
    this.selectedCurrency = this._cookieUtilsService.getValue('currency');
  }

  public updateCurrencyCookie() {
      this._cookieUtilsService.setValue('currency', this.selectedCurrency);
  }

}
