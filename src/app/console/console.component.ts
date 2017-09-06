import {Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../_services/collection/collection.service';
import { AppConfig } from '../app.config';

@Component({
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements AfterViewInit {

  public activeTab: string;
  public userId: string;
  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              private cookieUtilsService: CookieUtilsService,
              private _collectionService: CollectionService,
              private appConfig: AppConfig,
              private cd: ChangeDetectorRef ) {
    this.activatedRoute.firstChild.url.subscribe((urlSegment) => {
      console.log('activated route is: ' +  JSON.stringify(urlSegment));
      this.activeTab = urlSegment[0].path;
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  /**
   * Check if the given tab is active tab
   * @param tabName
   * @returns {boolean}
   */
  public getActiveTab() {
    return this.activeTab;
  }

  /**
   * Set active tab
   * @param value
   */
  public setActiveTab(value) {
    this.activeTab = value;
  }
}
