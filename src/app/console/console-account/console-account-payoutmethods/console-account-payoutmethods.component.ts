import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ConsoleAccountComponent } from '../console-account.component';
import { PaymentService } from '../../../_services/payment/payment.service';
@Component({
  selector: 'app-console-account-payoutmethods',
  templateUrl: './console-account-payoutmethods.component.html',
  styleUrls: ['./console-account-payoutmethods.component.scss']
})
export class ConsoleAccountPayoutmethodsComponent implements OnInit {
  public loading: boolean;
  public payoutAccounts: Array<any>;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleAccountComponent: ConsoleAccountComponent,
    private _paymentService: PaymentService,
    private location: Location
  ) {
    this.loading = true;
    this.activatedRoute.pathFromRoot[4].queryParams.subscribe(params => {
      if (params['code']) {
        this.addAccount(params['code']);
        this.location.replaceState(this.location.path().split('?')[0]);
      } else {
        this.retrieveAccounts();
      }
    });
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      consoleAccountComponent.setActiveTab(urlSegment[0].path);
    });
  }

  addAccount(code: string) {
    this._paymentService.createConnectedAccount(code).subscribe(result => {
      this.retrieveAccounts();
    }, err => {
      console.log(err);
      this.location.replaceState('');
    });
  }

  ngOnInit() {
  }

  private retrieveAccounts() {
    this.payoutAccounts = [];
    this._paymentService.retrieveConnectedAccount().subscribe(result => {
      console.log(result);
      result.forEach(account => {
        this.payoutAccounts = this.payoutAccounts.concat(account.external_accounts.data);
      });
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  /**
   * editAccount
   */
  public editAccount(accountId: string) {
    this._paymentService.createLoginLink(accountId).subscribe(
      result => {
        console.log(result);
        window.location.href = result.url;
      }, err => {
        console.log(err);
      }
    );
  }
}
