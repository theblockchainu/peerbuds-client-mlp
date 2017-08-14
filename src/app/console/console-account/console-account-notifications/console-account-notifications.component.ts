import { Component, OnInit } from '@angular/core';
import {ConsoleAccountComponent} from '../console-account.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-console-account-notifications',
  templateUrl: './console-account-notifications.component.html',
  styleUrls: ['./console-account-notifications.component.scss']
})
export class ConsoleAccountNotificationsComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleAccountComponent: ConsoleAccountComponent
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      if (urlSegment[0] === undefined) {
        consoleAccountComponent.setActiveTab('notifications');
      } else {
        consoleAccountComponent.setActiveTab(urlSegment[0].path);
      }
    });
  }

  ngOnInit() {
  }

}
