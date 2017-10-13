import { Component, OnInit } from '@angular/core';
import { ConsoleAccountComponent } from '../console-account.component';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../_services/payment/payment.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-console-account-transactionhistory',
  templateUrl: './console-account-transactionhistory.component.html',
  styleUrls: ['./console-account-transactionhistory.component.scss']
})
export class ConsoleAccountTransactionhistoryComponent implements OnInit {
  public transactions: Array<any>;
  public totalSpend: number;
  public years: Array<number>;
  public months: Array<any>;
  public filterForm: FormGroup;
  public retrievedTransactions: Array<any>;
  public totalTransactions: number;
  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleAccountComponent: ConsoleAccountComponent,
    private _paymentService: PaymentService,
    private _fb: FormBuilder
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleAccountComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.retrieveTransactions();
    this.setUpForm();
  }

  private setUpForm() {
    this.filterForm = this._fb.group({
      payout_method: '',
      content: '',
      year: '',
      fromMonth: '',
      toMonth: ''
    });

    this.filterForm.valueChanges.subscribe(result => {
      this.filterResults(result);
    });

    this.years = [];
    for (let index = 2000; index < 2030; index++) {
      this.years.push(index);
    }

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  }

  private filterResults(filter: any) {
    if (filter.payout_method.length > 0) {

    }
    if (filter.content.length > 0) {

    }
    if (filter.year > 0) {
      this.transactions = this.retrievedTransactions.filter((transaction) => {
        return (filter.year === moment(transaction.created).year());
      });
    }
    if (filter.fromMonth > 0) {
      this.transactions = this.retrievedTransactions.filter((transaction) => {
        return (filter.fromMonth <= moment(transaction.created).month());
      });
    }
    if (filter.toMonth > 0) {
      this.transactions = this.retrievedTransactions.filter((transaction) => {
        return (filter.toMonth >= moment(transaction.created).month());
      });
    }
  }

  private retrieveTransactions() {
    const query = { 'include': { 'collections': ['calendars'] } };
    this.retrievedTransactions = this.transactions;
    this._paymentService.getTransactions(query).subscribe(result => {
      this.transactions = result;
      this.totalTransactions = 0;
      result.forEach(element => {
        this.totalTransactions += element.amount;
      });
    }, err => {
      console.log(err);
    });
  }


}
