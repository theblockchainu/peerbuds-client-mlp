import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';
import {ConsoleComponent} from '../console.component';

declare var moment: any;
@Component({
  selector: 'app-console-teaching',
  templateUrl: './console-teaching.component.html',
  styleUrls: ['./console-teaching.component.scss', '../console.component.scss']
})
export class ConsoleTeachingComponent implements OnInit {

  public workshops: any;
  public loaded: boolean;
  public activeTab: string;
  public now: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService,
    public consoleComponent: ConsoleComponent) {
    activatedRoute.pathFromRoot[2].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.activeTab = 'all';
    this.now = new Date();
  }

  ngOnInit() {
    this.loaded = false;
  }

  /**
   * createWorkshop
   */
  public createWorkshop() {
    this._collectionService.postCollection('workshop').subscribe((workshopObject) => {
      this.router.navigate(['editWorkshop', workshopObject.id, 1]);
    });
  }

  /**
   * createExperience
   */
  public createExperience() {
    this._collectionService.postCollection('experience').subscribe((experienceObject) => {
      this.router.navigate(['editExperience', experienceObject.id, 1]);
    });
  }

  /**
   * createExperience
   */
  public enableSessions() {
    this._collectionService.postCollection('session').subscribe((sessionObject) => {
      this.router.navigate(['enableSessions', sessionObject.id, 1]);
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
   * Set value of activeTab
   * @param value
   */
  public setActiveTab(value) {
    this.activeTab = value;
  }

  /**
   * Show popup to rate students
   */
  public showRateStudentsPopup() {
    // Show popup here
  }

}
