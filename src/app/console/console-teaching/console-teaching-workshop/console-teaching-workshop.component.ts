import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../../_services/collection/collection.service';
import { ConsoleTeachingComponent } from '../console-teaching.component';
import { AppConfig } from '../../../app.config';
import * as _ from 'lodash';
declare var moment: any;
import { MdDialog } from '@angular/material';
import { CohortDetailDialogComponent } from './cohort-detail-dialog/cohort-detail-dialog.component';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-console-teaching-workshop',
  templateUrl: './console-teaching-workshop.component.html',
  styleUrls: ['./console-teaching-workshop.component.scss', '../console-teaching.component.scss', '../../console.component.scss']
})
export class ConsoleTeachingWorkshopComponent implements OnInit {

  public collections: any;
  public loaded: boolean;
  public now: Date;
  private userId;
  public drafts: Array<any>;
  public ongoingArray: Array<any>;
  public upcomingArray: Array<any>;
  public pastArray: Array<any>;
  public pastWorkshopsObject: any;
  public liveWorkshopsObject: any;
  public upcomingWorkshopsObject: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleTeachingComponent: ConsoleTeachingComponent,
    public _collectionService: CollectionService,
    private _cookieUtilsService: CookieUtilsService,
    public router: Router,
    public config: AppConfig,
    public dialog: MdDialog
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      if (urlSegment[0] === undefined) {
        consoleTeachingComponent.setActiveTab('workshops');
      } else {
        consoleTeachingComponent.setActiveTab(urlSegment[0].path);
      }
    });
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getOwnedCollections(this.userId, '{ "where": {"type":"workshop"}, "include": ["calendars", "owners", {"participants": "profiles"}, "topics", {"contents":"schedules"}] }', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.drafts = [];
        this.ongoingArray = [];
        this.upcomingArray = [];
        this.pastArray = [];
        this.pastWorkshopsObject = {};
        this.liveWorkshopsObject = {};
        this.upcomingWorkshopsObject = {};
        this.createOutput(result);
        this.now = new Date();
        this.loaded = true;
      }
    });
  }

  private createOutput(data: any) {
    const now = moment();
    data.forEach(workshop => {
      if (workshop.status === 'draft' || workshop.status === 'submitted') {
        this.drafts.push(workshop);
      } else {
        workshop.calendars.forEach(calendar => {
          if (calendar.endDate) {
            if (now.diff(moment.utc(calendar.endDate)) < 0) {
              if (!now.isBetween(calendar.startDate, calendar.endDate)) {
                if (workshop.id in this.upcomingWorkshopsObject) {
                  this.upcomingWorkshopsObject[workshop.id]['workshop']['calendars'].push(calendar);
                } else {
                  this.upcomingWorkshopsObject[workshop.id] = {};
                  this.upcomingWorkshopsObject[workshop.id]['workshop'] = _.clone(workshop);
                  this.upcomingWorkshopsObject[workshop.id]['workshop']['calendars'] = [calendar];
                }
              } else {
                if (workshop.id in this.liveWorkshopsObject) {
                  this.liveWorkshopsObject[workshop.id]['workshop']['calendars'].push(calendar);
                } else {
                  this.liveWorkshopsObject[workshop.id] = {};
                  this.liveWorkshopsObject[workshop.id]['workshop'] = _.clone(workshop);
                  this.liveWorkshopsObject[workshop.id]['workshop']['calendars'] = [calendar];
                }
              }

            } else {
              if (workshop.id in this.pastWorkshopsObject) {
                this.pastWorkshopsObject[workshop.id]['workshop']['calendars'].push(calendar);
              } else {
                this.pastWorkshopsObject[workshop.id] = {};
                this.pastWorkshopsObject[workshop.id]['workshop'] = workshop;
                this.pastWorkshopsObject[workshop.id]['workshop']['calendars'] = [calendar];
              }
            }
          }
        });
      }
    });
    for (const key in this.pastWorkshopsObject) {
      if (this.pastWorkshopsObject.hasOwnProperty(key)) {
        this.pastArray.push(this.pastWorkshopsObject[key].workshop);
      }
    }
    for (const key in this.upcomingWorkshopsObject) {
      if (this.upcomingWorkshopsObject.hasOwnProperty(key)) {
        this.upcomingArray.push(this.upcomingWorkshopsObject[key].workshop);
      }
    }
    for (const key in this.liveWorkshopsObject) {
      if (this.liveWorkshopsObject.hasOwnProperty(key)) {
        this.ongoingArray.push(this.liveWorkshopsObject[key].workshop);
      }
    }
  }

  public onSelect(workshop) {
    this.router.navigate(['/workshop/', workshop.id, 'edit', workshop.stage ? workshop.stage : 1]);
  }

  public createWorkshop() {
    this._collectionService.postCollection(this.userId, 'workshop').subscribe((workshopObject) => {
      this.router.navigate(['workshop', workshopObject.id, 'edit', 1]);
    });
  }

  public openCohortDetailDialog(cohortData: any) {
    const dialogRef = this.dialog.open(CohortDetailDialogComponent, {
      width: '700px',
      height: '600px',
      data: cohortData
    });
  }
}
