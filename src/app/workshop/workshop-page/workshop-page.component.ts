import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { MdDialog } from '@angular/material';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AppConfig } from '../../app.config';
import * as moment from 'moment';
import _ from 'lodash';

import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ViewParticipantsComponent } from './view-participants/view-participants.component';
import { WorkshopVideoComponent } from './workshop-video/workshop-video.component';
import { ContentOnlineComponent } from './content-online/content-online.component';
import { ContentVideoComponent } from './content-video/content-video.component';
import { ContentProjectComponent } from './content-project/content-project.component';
import { MessageParticipantComponent } from './message-participant/message-participant.component';
import { SelectDateDialogComponent } from './select-date-dialog/select-date-dialog.component';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
// import { NgModal } from 'ngx-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-workshop-page',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class WorkshopPageComponent implements OnInit {

  public workshopId: string;
  public userId: string;
  public booked = false;
  public userType: string;
  public totalDuration: string;
  public calendarId: string;
  public userRating: number;

  public isReadonly = true;
  public noOfReviews = 4;
  private initialised = false;

  public itenaryArray = [];
  public workshop: any;
  public currentCalendar: any;
  public chatForm: FormGroup;
  public modalContent: any;
  public topicFix: any;
  public messagingParticipant: any;
  public allItenaries = [];
  public itenariesObj = {};

  public recommendations = {
    collections: []
  };

  // Calendar Start
  public dateClicked: boolean = false;
  public clickedDate;
  public eventsForTheDay;
  public headerTemplate = `<ng-template #headerTemplate>
                            <div class="cal-cell-row cal-header">
                            <div class="cal-cell" *ngFor="let day of days" [class.cal-past]="day.isPast" [class.cal-today]="day.isToday"
                                [class.cal-future]="day.isFuture"
                                [class.cal-weekend]="day.isWeekend"
                                [ngClass]="day.cssClass">RRR
                            </div>
                          </div>
                          </ng-template>`;

  public view: string = 'month';

  public viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  public modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.dateClicked = true; // !this.dateClicked;
    this.clickedDate = date;
    this.eventsForTheDay = events;
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }


  // Calendar Ends

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilsService: CookieUtilsService,
    private _collectionService: CollectionService,
    private config: AppConfig,
    private _fb: FormBuilder,
    private dialog: MdDialog,
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (this.initialised && (this.workshopId !== params['workshopId'] || this.calendarId !== params['calendarId'])) {
        location.reload();
      }
      this.workshopId = params['workshopId'];
      this.calendarId = params['calendarId'];
      console.log('route changed');
    });
    this.userId = cookieUtilsService.getValue('userId');
    console.log(this.events);
  }

  ngOnInit() {
    this.initialised = true;
    this.initializeWorkshop();
    this.initializeForms();
  }


  private initializeUserType() {
    if (this.workshop) {
      for (const owner of this.workshop.owners) {
        if (owner.id === this.userId) {
          this.userType = 'teacher';
          break;
        }
      }
      if (!this.userType && this.currentCalendar) {
        for (const participant of this.workshop.participants) {
          if (participant.id === this.userId) {
            this.userType = 'participant';
            break;
          }
        }
      }
      if (!this.userType) {
        this.userType = 'public';
      }
      if (this.userType === 'public' || this.userType === 'teacher') {
        this.initializeAllItenaries();
      }
      console.log('Welcome ' + this.userType);

    }
  }

  private initializeAllItenaries() {
    this.workshop.calendars.forEach(calendar => {
      const calendarItenary = [];
      for (const key in this.itenariesObj) {
        if (this.itenariesObj.hasOwnProperty(key)) {
          const eventDate = this.calculateDate(calendar.startDate, key);
          this.itenariesObj[key].sort(function (a, b) {
            return parseFloat(a.schedules[0].startTime) - parseFloat(b.schedules[0].startTime);
          });
          const itenary = {
            startDay: key,
            startDate: eventDate,
            contents: this.itenariesObj[key]
          };
          calendarItenary.push(itenary);
        }
      }
      this.allItenaries.push(
        {
          calendar: calendar,
          itenary: calendarItenary
        });

    });
  }

  private initializeWorkshop() {
    const query = {
      'include': [
        'topics',
        'calendars',
        { 'participants': [{ 'profiles': ['work'] }] },
        { 'owners': [{ 'profiles': ['work'] }] },
        { 'contents': ['schedules'] },
        { 'reviews': [{ 'peer': ['profiles'] }] }
      ]
    };

    if (this.workshopId) {
      this._collectionService.getCollectionDetail(this.workshopId, query)
        .subscribe(res => {
          console.log(res);
          this.workshop = res;
          this.setCurrentCalendar();
          this.workshop.contents.forEach(contentObj => {
            if (this.itenariesObj.hasOwnProperty(contentObj.schedules[0].startDay)) {
              this.itenariesObj[contentObj.schedules[0].startDay].push(contentObj);
            } else {
              this.itenariesObj[contentObj.schedules[0].startDay] = [contentObj];
            }
          });
          for (const key in this.itenariesObj) {
            if (this.itenariesObj.hasOwnProperty(key)) {
              let eventDate;
              if (this.currentCalendar) {
                eventDate = this.calculateDate(this.currentCalendar.startDate, key);
              } else {
                eventDate = this.calculateDate(this.workshop.calendars[0].startDate, key);
              }
              this.itenariesObj[key].sort(function (a, b) {
                return parseFloat(a.schedules[0].startTime) - parseFloat(b.schedules[0].startTime);
              });
              const itenary = {
                startDay: key,
                startDate: eventDate,
                contents: this.itenariesObj[key]
              };
              this.itenaryArray.push(itenary);
            }
          }

          this.itenaryArray.sort(function (a, b) {
            return parseFloat(a.startDay) - parseFloat(b.startDay);
          });
          // console.log(this.itenaryArray);
          for (let iterinary of this.itenaryArray) {
            let startDate = moment(iterinary.startDate).format('YYYY-MM-DD');
            for (var i = 0; i < iterinary.contents.length; i++) {
              let schedule = iterinary.contents[i].schedules;
              debugger;
              const startTime = moment.utc(schedule[0].startTime).local().format('HH:mm:ss');
              const endTime = moment.utc(schedule[0].endTime).local().format('HH:mm:ss');
              this.events.push({
                title: iterinary.contents[i].title,
                color: colors.red,
                start: moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
                end:  moment(startDate + ' ' + endTime, 'YYYY-MM-DD HH:mm:ss').toDate()
              });
            }
            // this.refresh.next();
          }

          // console.log(this.events);
        },
        err => console.log('error'),
        () => {
          console.log('Completed!');
          this.initializeUserType();
          this.calculateTotalHours();
          this.fixTopics();
          this.userRating = this.calculateRating(this.workshop);
          this.getRecommendations();
        });


    } else {
      console.log('NO COLLECTION');
    }
  }

  private calculateRating(workshop) {
    let reviewScore = 0;
    let totalScore = 0;
    for (const reviewObject of workshop.reviews) {
      reviewScore += reviewObject.score;
      totalScore += 5;
    }
    return totalScore / reviewScore;
  }

  private fixTopics() {
    this.topicFix = _.uniqBy(this.workshop.topics, 'id');
  }

  private initializeForms() {
    this.chatForm = this._fb.group({
      message: ['', Validators.required],
      announce: ''
    });
  }

  gotoEdit() {
    this.router.navigate(['workshop', this.workshopId, 'edit', 1]);
  }

  public setCurrentCalendar() {
    if (this.calendarId) {
      const calendarIndex = this.workshop.calendars.findIndex(calendar => {
        return calendar.id === this.calendarId;
      });
      if (calendarIndex > -1) {
        this.currentCalendar = this.workshop.calendars[calendarIndex];
      } else {
        console.log('Calendar instance not found');
      }
    } else {
      console.log('Calendar id not found');
    }
  }

  /**
   * changeDates
   */
  public changeDates() {
    const dialogRef = this.dialog.open(SelectDateDialogComponent, {
      width: '800px',
      height: '500px',
      data: this.allItenaries
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['workshop', this.workshopId, 'calendar', result]);

    });
  }
  /**
   * joinGroupChat
   */
  public joinGroupChat() {
    console.log('Join Group Chat');
  }

  /**
   * cancelWorkshop
   */
  public cancelWorkshop() {
    console.log('cancel Workshop');
  }

  /**
   * deleteWorkshop
   */
  public deleteWorkshop() {
    this._collectionService.deleteCollection(this.workshopId).subscribe((response) => {
      this.router.navigate(['/console/teaching/workshops']);
    });
  }

  /**
   * calculateDate
   */
  public calculateDate(fromdate, day) {
    const tempMoment = moment(fromdate);
    tempMoment.add(day, 'days');
    return tempMoment;
  }

  /**
   * postMessage
   */
  public postMessage() {
    console.log(this.chatForm.value);
  }

  /**
   * calculateTotalHours
   */
  public calculateTotalHours() {
    let totalLength = 0;
    this.workshop.contents.forEach(content => {
      if (content.type === 'online') {
        const startMoment = moment(content.schedules[0].startTime);
        const endMoment = moment(content.schedules[0].endTime);
        const contentLength = moment.utc(endMoment.diff(startMoment)).format('HH');
        totalLength += parseInt(contentLength, 10);
      } else if (content.type === 'video') {

      }
    });
    this.totalDuration = totalLength.toString();
  }

  /**
   * isLive
   */
  public isLive(content: any) {
    const startMoment = moment(this.workshop.calendars[0].startDate);
    const endMoment = moment(this.workshop.calendars[0].startDate);
    const currentMoment = moment();
    startMoment.add(content.schedules[0].startDay, 'day');
    endMoment.add(content.schedules[0].startDay, 'day');

    const startTime = moment(content.schedules[0].startTime);
    const endTime = moment(content.schedules[0].endTime);

    startMoment.hours(startTime.hours());
    startMoment.minutes(startTime.minutes());

    endMoment.hours(endTime.hours());
    endMoment.minutes(endTime.minutes());

    if (currentMoment.isBetween(startMoment, endMoment)) {
      return true;
    } else {
      this.timetoSession(content);
      return false;
    }
  }

  /**
   * joinSession
content:any   */
  public joinSession(content: any) {
    console.log('Joining Session');
  }



  public getContentCount(type: string) {
    let count = 0;
    for (const content of this.workshop.contents) {
      if (content.type === type) {
        count++;
      }
    }
    return count;
  }

  /**
   * toggleReviews
   */
  public toggleReviews() {
    if (this.noOfReviews === 4) {
      this.noOfReviews = 100;
    } else {
      this.noOfReviews = 4;
    }
  }

  openDeleteDialog(action: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: action
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteWorkshop();
      } else if (result === 'cancel') {
        this.cancelWorkshop();
      } else {
        console.log(result);
      }
    });
  }

  workshopVideoDialog() {
    const dialogRef = this.dialog.open(WorkshopVideoComponent, {
      data: this.config.apiUrl + this.workshop.videoUrl
    });
  }

  viewParticipants() {
    const dialogRef = this.dialog.open(ViewParticipantsComponent, {
      data: this.workshop.participants,
      width: '800px'
    });
  }

  /**
 * openDialog
content:any   */
  public openDialog(content: any) {
    this.modalContent = content;
    switch (content.type) {
      case 'online':
        {
          const dialogRef = this.dialog.open(ContentOnlineComponent, {
            data: content,
            width: '800px',
            height: '700px'
          });
          break;
        }
      case 'video':
        {
          const dialogRef = this.dialog.open(ContentVideoComponent, {
            data: content,
            width: '800px',
            height: '600px'
          }); break;
        }
      case 'project':
        {
          const dialogRef = this.dialog.open(ContentProjectComponent, {
            data: {
              content: content,
              userType: this.userType
            },
            width: '800px'
          }); break;
        }
      default:
        break;
    }

  }

  /**
  * timetoSession
content:any   */
  public timetoSession(content: any) {
    const startMoment = moment(this.workshop.calendars[0].startDate);
    const endMoment = moment(this.workshop.calendars[0].startDate);
    const currentMoment = moment();
    startMoment.add(content.schedules[0].startDay, 'day');
    endMoment.add(content.schedules[0].startDay, 'day');

    const startTime = moment(content.schedules[0].startTime);
    const endTime = moment(content.schedules[0].endTime);

    startMoment.hours(startTime.hours());
    startMoment.minutes(startTime.minutes());

    endMoment.hours(endTime.hours());
    endMoment.minutes(endTime.minutes());

    if (startMoment.diff(currentMoment) < 0) {
      content.timetoSession = endMoment.fromNow();
    } else {
      content.timetoSession = startMoment.toNow();
    }
  }

  /**
   * getRecommendations
   */
  public getRecommendations() {
    const query = {
      'include': [
        'calendars',
        { 'owners': ['profiles'] },
        'reviews',
        'topics',
        'participants'
      ],
      'limit': 4
    };
    this._collectionService.getRecommendations(query, (err, response: any) => {
      if (err) {
        console.log(err);
      } else {
        for (const responseObj of response) {
          responseObj.rating = this.calculateRating(responseObj);
          console.log(responseObj);
          this.recommendations.collections.push(responseObj);
        }
      }
    });
  }

  /**
   * selectJoiningDates
   */
  public selectJoiningDates() {
    const dialogRef = this.dialog.open(SelectDateDialogComponent, {
      width: '800px',
      height: '500px',
      data: this.allItenaries
    });
    dialogRef.afterClosed().subscribe(result => {
      this.joinWorkshop(result);
    });
  }

  private joinWorkshop(calendarId: string) {
    this._collectionService.addParticipant(this.workshopId, this.userId, calendarId, (err: any, response: any) => {
      if (err) {
        console.log(err);
      } else {
        this.router.navigate(['workshop', this.workshopId, 'calendar', calendarId]);
      }
    });
  }

  private extractTime(dateString: string) {
    const time = moment.utc(dateString).local().format('HH:mm:ss');
    return time;
  }

}
