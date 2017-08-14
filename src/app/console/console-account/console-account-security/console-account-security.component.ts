import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConsoleAccountComponent} from '../console-account.component';

@Component({
  selector: 'app-console-account-security',
  templateUrl: './console-account-security.component.html',
  styleUrls: ['./console-account-security.component.scss']
})
export class ConsoleAccountSecurityComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleAccountComponent: ConsoleAccountComponent
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleAccountComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
  }

}
