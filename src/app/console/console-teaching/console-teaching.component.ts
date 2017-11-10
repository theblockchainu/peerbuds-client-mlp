import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { ConsoleComponent } from '../console.component';

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
  private userId;
  public accountVerified: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService,
    private _cookieUtilsService: CookieUtilsService,
    public consoleComponent: ConsoleComponent) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.activeTab = 'all';
    this.now = new Date();
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.loaded = false;
    this.accountVerified = (this._cookieUtilsService.getValue('accountApproved') === 'true') ? true : false;
  }

  /**
   * createWorkshop
   */
  public createWorkshop() {
    this._collectionService.postCollection(this.userId, 'workshop').subscribe((workshopObject) => {
      this.router.navigate(['workshop', workshopObject.id, 'edit', 1]);
    });
  }

  /**
   * createExperience
   */
  public createExperience() {
    this._collectionService.postCollection(this.userId, 'experience').subscribe((experienceObject) => {
      this.router.navigate(['editExperience', experienceObject.id, 1]);
    });
  }

  /**
   * createExperience
   */
  public enableSessions() {
    this._collectionService.postCollection(this.userId, 'session').subscribe((sessionObject) => {
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

  imgErrorHandler(event) {
    event.target.src = '/assets/images/user-placeholder.jpg';
  }


}
