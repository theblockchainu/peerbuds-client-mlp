import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConsoleComponent} from '../console.component';

@Component({
  selector: 'app-console-dashboard',
  templateUrl: './console-dashboard.component.html',
  styleUrls: ['./console-dashboard.component.scss']
})
export class ConsoleDashboardComponent implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    consoleComponent: ConsoleComponent
  ) {
    activatedRoute.pathFromRoot[2].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
  }

}
