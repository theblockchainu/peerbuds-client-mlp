import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';
import {ConsoleComponent} from '../console.component';

declare var moment: any;

@Component({
  selector: 'app-console-account',
  templateUrl: './console-account.component.html',
  styleUrls: ['./console-account.component.scss']
})
export class ConsoleAccountComponent implements OnInit {

  public workshops: any;
  public loaded: boolean;
  public activeTab: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService,
    public consoleComponent: ConsoleComponent) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.activeTab = 'notifications';
  }

  ngOnInit() {
    this.loaded = false;
  }

  /**
   * createWorkshop
   */
  public createWorkshop() {
    this._collectionService.postCollection('workshop').subscribe((workshopObject) => {
      this.router.navigate(['workshop', workshopObject.id, 'edit', 1]);
    });
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
   * Set activeTab value
   * @param value
   */
  public setActiveTab(value) {
    this.activeTab = value;
  }

}
