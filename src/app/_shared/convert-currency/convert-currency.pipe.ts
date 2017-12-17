import { Pipe, PipeTransform } from '@angular/core';
import { PaymentService } from '../../_services/payment/payment.service';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
@Pipe({
  name: 'convertCurrency'
})
export class ConvertCurrencyPipe implements PipeTransform {
  constructor(private _paymentService: PaymentService,
    private _currencyPipe: CurrencyPipe,
    private _cookieUtilsService: CookieUtilsService) {
  }

  transform(amount: any, fromCurrency: string): any {
    if (amount === 0) {
      // create observable
      return new Observable((observer) => {
        observer.next('FREE');
      });
    } else {
      return this._paymentService.convertCurrency(amount, fromCurrency).map(
        res => {
          return this._currencyPipe.transform(res.amount, res.currency, true, '1.0-0');
        }
      );
    }
  }

}
