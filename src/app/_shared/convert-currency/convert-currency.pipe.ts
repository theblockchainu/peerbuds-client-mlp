import { Pipe, PipeTransform } from '@angular/core';
import { PaymentService } from '../../_services/payment/payment.service';
import { CurrencyPipe } from '@angular/common';
@Pipe({
  name: 'convertCurrency'
})
export class ConvertCurrencyPipe implements PipeTransform {
  constructor(private _paymentService: PaymentService,
    private _currencyPipe: CurrencyPipe) {
  }

  transform(amount: any, fromCurrency: string): any {
    return this._paymentService.convertCurrency(amount, fromCurrency).map(
      res => {
        console.log(this._currencyPipe.transform(res.amount, res.currency, true, '1.0-0'));
        return this._currencyPipe.transform(res.amount, res.currency, true, '1.0-0');
      }
    );
  }

}