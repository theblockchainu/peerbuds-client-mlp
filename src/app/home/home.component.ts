import { AppConfig } from '../app.config';
import { Component, OnInit } from '@angular/core';
import { Router, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../_services/collection/collection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public activeTab: string;
  public userId: string;
  constructor(public router: Router,
    private cookieUtilsService: CookieUtilsService,
    private _collectionService: CollectionService,
    private appConfig: AppConfig) {
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
  }

}
