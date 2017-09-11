import { Component, OnInit } from '@angular/core';
import {ConsoleAccountComponent} from '../console-account.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-console-account-transactionhistory',
  templateUrl: './console-account-transactionhistory.component.html',
  styleUrls: ['./console-account-transactionhistory.component.scss']
})
export class ConsoleAccountTransactionhistoryComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleAccountComponent: ConsoleAccountComponent
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleAccountComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
  }

}
