import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleTeachingComponent } from '../console-teaching.component';
import { CollectionService } from '../../../_services/collection/collection.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-console-teaching-session',
  templateUrl: './console-teaching-session.component.html',
  styleUrls: ['./console-teaching-session.component.scss', '../console-teaching.component.scss', '../../console.component.scss']
})
export class ConsoleTeachingSessionComponent implements OnInit {

  private userId;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleTeachingComponent: ConsoleTeachingComponent,
    public router: Router,
    public _collectionService: CollectionService,
    private _cookieUtilsService: CookieUtilsService
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleTeachingComponent.setActiveTab(urlSegment[0].path);
    });
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {

  }

}
