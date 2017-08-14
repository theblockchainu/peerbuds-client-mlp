import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConsoleComponent} from '../console.component';

@Component({
  selector: 'app-console-inbox',
  templateUrl: './console-inbox.component.html',
  styleUrls: ['./console-inbox.component.scss']
})
export class ConsoleInboxComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleComponent: ConsoleComponent
  ) {
    activatedRoute.pathFromRoot[2].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
  }

}
