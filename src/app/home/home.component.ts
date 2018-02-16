import { AppConfig } from '../app.config';
import { Component, OnInit } from '@angular/core';
import { Router, Params, NavigationStart, ActivatedRoute } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../_services/collection/collection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public activeTab = 'homefeed';
  public userId;
  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilsService: CookieUtilsService,
    private _collectionService: CollectionService,
    private appConfig: AppConfig,
    private _cookieUtilsService: CookieUtilsService) {
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
      this.activatedRoute.firstChild.url.subscribe((urlSegment) => {
          console.log('activated route is: ' + JSON.stringify(urlSegment));
          this.activeTab = urlSegment[0].path;
      });
      this.router.events.subscribe(event => this.updateActiveLink(event));
  }

  public updateActiveLink(location) {
      if (location !== undefined && location.url !== undefined) {
          this.activeTab = location.url.split('/')[location.url.split('/').length - 1];
      }
  }

}
