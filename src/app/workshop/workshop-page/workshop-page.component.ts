import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { CommentService } from '../../_services/comment/comment.service';

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
declare var FB: any;

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
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';

import { DialogsService } from '../dialogs/dialog.service';
import { TopicService } from '../../_services/topic/topic.service';

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
  public userType: string;
  public totalDuration: string;
  public calendarId: string;
  public userRating: number;
  public newUserRating = 0;
  public liveCohort;
  public isViewTimeHidden = true;

  public isReadonly = true;
  public noOfReviews = 3;
  private initialised = false;
  public bookmarks;
  public hasBookmarked = false;
  public replyingToCommentId: string;
  public itenaryArray = [];
  public workshop: any;
  public currentCalendar: any;
  public chatForm: FormGroup;
  public modalContent: any;
  public topicFix: any;
  public messagingParticipant: any;
  public allItenaries = [];
  public itenariesObj = {};
  public reviews;
  public defaultProfileUrl = '/assets/images/avatar.png';
  public noWrapSlides = true;
  public peerHasSubmission = false;
  public contentHasSubmission = {};
  public participants = [];
  public allParticipants = [];
  public isRatingReceived = false;

  public replyForm: FormGroup;
  public reviewForm: FormGroup;
  public recommendations = {
    collections: []
  };
  public result;

  public comments: Array<any>;

  // Calendar Start
  public dateClicked = false;
  public clickedDate;
  public clickedCohort;
  public clickedCohortId;
  public clickedCohortStartDate;
  public clickedCohortEndDate;
  public eventsForTheDay = {};
  public toOpenDialogName;
  objectKeys = Object.keys;

  public view = 'month';

  public activityMapping:
  { [k: string]: string } = { '=0': 'No activity', '=1': 'One activity', 'other': '# activities' };
  public hourMapping:
  { [k: string]: string } = { '=0': 'Less than an hour', '=1': 'One hour', 'other': '# hours' };
  public cohortMapping:
  { [k: string]: string } = { '=0': 'No cohort', '=1': 'One cohort', 'other': '# cohorts' };
  public discussionMapping:
  { [k: string]: string } = { '=0': 'No Comments', '=1': 'One comment', 'other': '# comments' };

  public viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen = true;
  public loadingSimilarWorkshops = true;
  public loadingComments = true;
  public loadingParticipants = true;
  public loadingWorkshop = true;
  public loadingReviews = true;

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilsService: CookieUtilsService,
    public _collectionService: CollectionService,
    public _topicService: TopicService,
    private _commentService: CommentService,
    public config: AppConfig,
    private _fb: FormBuilder,
    private dialog: MdDialog,
    private dialogsService: DialogsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (this.initialised && (this.workshopId !== params['workshopId'] || this.calendarId !== params['calendarId'])) {
        location.reload();
      }
      this.workshopId = params['workshopId'];
      this.calendarId = params['calendarId'];
      this.toOpenDialogName = params['dialogName'];
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.initialised = true;
    this.initializeWorkshop();
    this.initializeForms();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.eventsForTheDay = {};
    if (events.length === 0) {
      this.dateClicked = false;
      return;
    }
    else {
      this.dateClicked = true; // !this.dateClicked;
    }
    this.clickedDate = date;
    this.clickedCohort = this.parseTitle(events[0].title)[0];
    this.clickedCohortId = this.parseTitle(events[0].title)[1];
    this.clickedCohortStartDate = events[0].start;
    this.clickedCohortEndDate = events[0].end;
    for (const event of events) {
      const titleCalIdArray = this.parseTitle(event.title);
      const calId = titleCalIdArray[1];
      const title = titleCalIdArray[0];
      const type = titleCalIdArray[2];
      const eventId = titleCalIdArray[3];
      if (type !== 'cohort') {
        if (!this.eventsForTheDay.hasOwnProperty(calId)) {
          this.eventsForTheDay[calId] = [{
            id: eventId,
            title: title,
            color: event.color,
            start: event.start,
            end: event.end
          }];
        }
        else {
          this.eventsForTheDay[calId].push({
            id: eventId,
            title: title,
            color: event.color,
            start: event.start,
            end: event.end
          });
        }
      }
    }
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public parseTitle(title) {
    return title.split(':');
  }

  // Modal
  public editCalendar() {
    this.dialogsService
      .editCalendar({ id: this.workshopId, type: this.workshop.type, name: this.workshop.title }, this.workshop.contents, this.workshop.calendars, this.allItenaries, this.allParticipants, this.events, this.userId, this.workshop.calendars[0].startDate, this.workshop.calendars[0].endDate)
      .subscribe(res => {
        this.result = res;
        if (this.result === 'calendarsSaved') {
          this.initializeWorkshop();
        }
      });
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
        if (this.calendarId) {
          this.router.navigate(['workshop', this.workshopId]);
        }
      }
      if (this.userType === 'public' || this.userType === 'teacher') {
        this.initializeAllItenaries();
      }

      this.loadingWorkshop = false;

    }
  }

  private initializeAllItenaries() {
    this.workshop.calendars.forEach((calendar, index) => {
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
      index++;
      this.events.push({
        title: 'Cohort ' + index + ':' + calendar.id + ':cohort:',
        color: colors.red,
        start: moment.utc(calendar.startDate, 'YYYY-MM-DD HH:mm:ss').local().toDate(),
        end: moment.utc(calendar.endDate, 'YYYY-MM-DD HH:mm:ss').local().toDate(),
        cssClass: 'workshopCohortCalendar'
      });
    });

    console.log(this.allItenaries);
    for (const indvIterinary of this.allItenaries) {
      const calendarId = indvIterinary.calendar.id;
      for (const iterinary of indvIterinary.itenary) {
        const startDate = moment(iterinary.startDate).format('YYYY-MM-DD');
        for (let i = 0; i < iterinary.contents.length; i++) {
          const schedule = iterinary.contents[i].schedules;
          const startTime = moment.utc(schedule[0].startTime).local().format('HH:mm:ss');
          const endTime = moment.utc(schedule[0].endTime).local().format('HH:mm:ss');
          this.events.push({
            title: iterinary.contents[i].title + ':' + calendarId + ':content:' + iterinary.contents[i].id,
            color: colors.red,
            start: moment(startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
            end: moment(startDate + ' ' + endTime, 'YYYY-MM-DD HH:mm:ss').toDate()
          });
        }
      }
    }
    console.log(this.events);
  }

  private initializeWorkshop() {
    const query = {
      'include': [
        'topics',
        'calendars',
        'views',
        { 'participants': [{ 'profiles': ['work'] }] },
        { 'owners': [{ 'profiles': ['work'] }] },
        { 'contents': ['schedules', { 'views': 'peer' }, { 'submissions': [{ 'upvotes': 'peer' }, { 'peer': 'profiles' }] }] }
      ],
      'relInclude': 'calendarId'
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

            if (contentObj.submissions && contentObj.submissions.length > 0) {
              contentObj.submissions.forEach(submission => {
                if (submission.peer) {
                  if (this.userId === submission.peer[0].id) {
                    this.peerHasSubmission = true;
                  }
                }
              });
            }
          });

          for (const key in this.itenariesObj) {
            if (this.itenariesObj.hasOwnProperty(key)) {
              let startDate, endDate;
              if (this.currentCalendar) {
                startDate = this.calculateDate(this.currentCalendar.startDate, key);
                endDate = this.calculateDate(this.currentCalendar.startDate, key);
              } else {
                startDate = this.calculateDate(this.workshop.calendars[0].startDate, key);
                endDate = this.calculateDate(this.workshop.calendars[0].startDate, key);
              }
              this.itenariesObj[key].sort(function (a, b) {
                return parseFloat(a.schedules[0].startTime) - parseFloat(b.schedules[0].startTime);
              });
              this.itenariesObj[key].forEach(content => {
                if (content.schedules[0].startTime !== undefined) {
                  content.schedules[0].startTime = startDate.format().toString().split('T')[0] + 'T' + content.schedules[0].startTime.split('T')[1];
                  content.schedules[0].endTime = startDate.format().toString().split('T')[0] + 'T' + content.schedules[0].endTime.split('T')[1];
                }
              });
              this.setContentViews(this.itenariesObj[key]);
              const itenary = {
                startDay: key,
                startDate: startDate,
                endDate: endDate,
                contents: this.itenariesObj[key]
              };
              this.itenaryArray.push(itenary);
            }
          }
          this.itenaryArray.sort(function (a, b) {
            return parseFloat(a.startDay) - parseFloat(b.startDay);
          });


        },
        err => console.log('error'),
        () => {
          this.initializeUserType();
          this.calculateTotalHours();
          this.fixTopics();
          this.getReviews();
          this.getRecommendations();
          this.getParticipants();
          this.getDiscussions();
          this.getBookmarks();
          if (this.toOpenDialogName !== undefined) {
            this.itenaryArray.forEach(itinerary => {
              itinerary.contents.forEach(content => {
                if (content.id === this.toOpenDialogName) {
                  this.openDialog(content);
                }
              });
            });
          }
        });
    } else {
      console.log('NO COLLECTION');
    }
  }
  private getReviews() {
    this.loadingReviews = true;
    let query = {};
    if (this.calendarId) {
      query = {
        'include': [
          {
            'peer': ['profiles']
          }],
        'where': { 'and': [{ 'collectionId': this.workshopId }, { 'collectionCalendarId': this.calendarId }] }
      };
    }
    else {
      query = {
        'include': [
          {
            'peer': ['profiles']
          }],
        'where': { 'collectionId': this.workshopId }
      };
    }
    this._collectionService.getReviews(this.workshop.owners[0].id, query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
        this.reviews = response;
        this.userRating = this._collectionService.calculateRating(this.reviews);
        this.loadingReviews = false;
      }
    });
  }

  private getBookmarks() {
    const query = {
      'include': [
        {
          'peer': [
            { 'profiles': ['work'] }
          ]
        }
      ],
      'order': 'createdAt DESC'
    };
    this._collectionService.getBookmarks(this.workshopId, query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        this.bookmarks = response;
        this.bookmarks.forEach(bookmark => {
          if (bookmark.peer[0].id === this.userId) {
            this.hasBookmarked = true;
          }
        });
      }
    });
  }

  private getDiscussions() {
    this.loadingComments = true;
    const query = {
      'include': [
        {
          'peer': [
            { 'profiles': ['work'] }
          ]
        },
        {
          'replies': [
            {
              'peer': [
                {
                  'profiles': ['work']
                }
              ]
            },
            {
              'upvotes': 'peer'
            }
          ]
        },
        {
          'upvotes': 'peer'
        }
      ],
      'order': 'createdAt DESC'
    };
    this._collectionService.getComments(this.workshopId, query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        this.comments = response;
        this.loadingComments = false;
      }
    });
  }

  private fixTopics() {
    this.topicFix = _.uniqBy(this.workshop.topics, 'id');
  }

  private initializeForms() {
    this.chatForm = this._fb.group({
      description: ['', Validators.required],
      isAnnouncement: [false]
    });
    this.reviewForm = this._fb.group({
      description: ['', Validators.required],
      like: '',
      score: '',
      collectionId: this.workshopId,
      collectionCalendarId: this.calendarId,
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
      width: '50vw',
      height: '90vh',
      data: { itineraries: this.allItenaries, mode: 'chooseDate', participants: this.allParticipants, userType: this.userType }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['workshop', this.workshopId, 'calendar', result]);
      }
    });
  }

  /**
   * cancelWorkshop
   */
  public cancelWorkshop() {
    if (this.userType === 'participant') {
      this._collectionService.removeParticipant(this.workshopId, this.userId).subscribe((response) => {
        location.reload();
      });
    } else if (this.userType === 'teacher') {
      const cancelObj = {
        isCancelled: true
      };
      this._collectionService.patchCollection(this.workshopId, cancelObj).subscribe((response) => {
        location.reload();
      });
    }
    else {
      console.log('cancel Workshop');
    }
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
   * postComment
   */
  public postComment() {
    this._collectionService.postComments(this.workshopId, this.chatForm.value, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        this.chatForm.reset();
        this.getDiscussions();
      }
    });
  }

  /**
   * saveBookmark
   */
  public saveBookmark() {
    if (!this.hasBookmarked) {
      this._collectionService.saveBookmark(this.workshopId, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          this.getBookmarks();
        }
      });
    }
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
    const startMoment = moment(this.currentCalendar.startDate);
    startMoment.add(content.schedules[0].startDay, 'day');
    const endMoment = startMoment.clone();
    endMoment.add(content.schedules[0].endDay, 'day');
    const currentMoment = moment();

    const startTime = moment(content.schedules[0].startTime);
    const endTime = moment(content.schedules[0].endTime);

    startMoment.hours(startTime.hours());
    startMoment.minutes(startTime.minutes());

    endMoment.hours(endTime.hours());
    endMoment.minutes(endTime.minutes());

    if (currentMoment.isBetween(startMoment, endMoment)) {
      content.isLive = true;
      return true;
    } else {
      this.timetoSession(content);
      return false;
    }
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
    if (this.noOfReviews === 3) {
      this.noOfReviews = 100;
    } else {
      this.noOfReviews = 3;
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
      data: {
        participants: this.participants,
        workshopId: this.workshopId
      },
      width: '50vw',
      height: '90vh'
    });
  }

  viewAllParticipants() {
    const dialogRef = this.dialog.open(ViewParticipantsComponent, {
      data: {
        participants: this.allParticipants,
        workshopId: this.workshopId
      },
      width: '50vw',
      height: '90vh'
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
            data: {
              content: content,
              userType: this.userType,
              collectionId: this.workshopId
            },
            width: '40vw',
            height: '100vh'
          });
          break;
        }
      case 'video':
        {
          const dialogRef = this.dialog.open(ContentVideoComponent, {
            data: {
              content: content,
              userType: this.userType,
              collectionId: this.workshopId
            },
            width: '40vw',
            height: '100vh'
          });
          break;
        }
      case 'project':
        {
          const dialogRef = this.dialog.open(ContentProjectComponent, {
            data: {
              content: content,
              userType: this.userType,
              peerHasSubmission: this.peerHasSubmission,
              collectionId: this.workshopId
            },
            width: '40vw',
            height: '100vh'
          });
          break;
        }
      default:
        break;
    }

  }

  /**
  * timetoSession
  content:any   */
  public timetoSession(content: any) {
    const startMoment = moment(this.currentCalendar.startDate);
    startMoment.add(content.schedules[0].startDay, 'day');
    const endMoment = startMoment.clone();
    endMoment.add(content.schedules[0].endDay, 'day');
    const currentMoment = moment();

    const startTime = moment(content.schedules[0].startTime);
    const endTime = moment(content.schedules[0].endTime);

    startMoment.hours(startTime.hours());
    startMoment.minutes(startTime.minutes());

    endMoment.hours(endTime.hours());
    endMoment.minutes(endTime.minutes());

    if (startMoment.diff(currentMoment, 'minutes') < 0) {
      content.timetoSession = endMoment.fromNow();
    } else {
      content.timetoSession = startMoment.fromNow();
    }
  }

  /**
   * getRecommendations
   */
  public getRecommendations() {
    this.loadingSimilarWorkshops = true;
    const query = {
      'include': [
        { 'collections': [{ 'owners': 'reviewsAboutYou' }] }
      ]
    };
    this._topicService.getTopics(query).subscribe(
      (response) => {
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.status === 'active') {
              if (collection.owners[0].reviewsAboutYou) {
                collection.rating = this._collectionService.calculateCollectionRating(collection.id, collection.owners[0].reviewsAboutYou);
                collection.ratingCount = this._collectionService.calculateCollectionRatingCount(collection.id, collection.owners[0].reviewsAboutYou);
              }
              this.recommendations.collections.push(collection);
            }
          });
        }
        this.recommendations.collections = _.uniqBy(this.recommendations.collections, 'id');
        this.recommendations.collections = _.chunk(this.recommendations.collections, 5)[0];
        this.loadingSimilarWorkshops = false;
      }, (err) => {
        console.log(err);
      }
    );
  }

  /**
   * selectJoiningDates
   */
  public selectJoiningDates() {
    const dialogRef = this.dialog.open(SelectDateDialogComponent, {
      width: '50vw',
      height: '90vh',
      data: { itineraries: this.allItenaries, mode: 'chooseDate', participants: this.allParticipants, userType: this.userType }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.userId) {
          this.router.navigate(['review-pay', 'collection', this.workshopId, result]);
          //this.joinWorkshop(result);
        } else {
          this.router.navigate(['login']);
        }
      }
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

  public viewDetails(key) {
    this.router.navigate(['workshop', this.workshopId, 'calendar', key]);
  }

  public openEventDialog(calendarId, eventId) {
    this.router.navigate(['workshop', this.workshopId, 'calendar', calendarId, eventId]);
  }

  public createReplyForm(comment: any) {
    this.replyingToCommentId = comment.id;
    this.replyForm = this._fb.group({
      description: ''
    });
  }

  /**
   * postReply
   */
  public postReply(comment: any) {
    this._commentService.replyToComment(comment.id, this.replyForm.value).subscribe(
      response => {
        this.getDiscussions();
        delete this.replyForm;
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * deleteReply
   */
  public deleteReply(reply: any) {
    this._commentService.deleteReply(reply.id).subscribe(
      response => {
        this.getDiscussions();
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * deleteComment
   */
  public deleteComment(comment: any) {
    this._commentService.deleteComment(comment.id).subscribe(
      response => {
        this.getDiscussions();
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * deleteReview
   */
  public deleteReview(review: any) {
    this._collectionService.deleteReview(review.id).subscribe(
      response => {
        this.getReviews();
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * handleRate
   */
  public handleRate(event) {
    this.reviewForm.controls['score'].setValue(event.value);
    this.isRatingReceived = true;
  }

  /**
   * postReview
   */
  public postReview() {
    this._collectionService.postReview(this.workshop.owners[0].id, this.reviewForm.value).subscribe(
      result => {
        if (result) {
          this.getReviews();
        }
      }, err => {
        console.log(err);
      }
    );
  }

  addCommentUpvote(comment: any) {
    this._commentService.addCommentUpvote(comment.id, {}).subscribe(
      response => {
        if (comment.upvotes !== undefined) {
          comment.upvotes.push(response.json());
        }
        else {
          comment.upvotes = [];
          comment.upvotes.push(response.json());
        }
      }, err => {
        console.log(err);
      }
    );
  }

  addReplyUpvote(reply: any) {
    this._commentService.addReplyUpvote(reply.id, {}).subscribe(
      response => {
        console.log(response);
        if (reply.upvotes !== undefined) {
          reply.upvotes.push(response.json());
        }
        else {
          reply.upvotes = [];
          reply.upvotes.push(response.json());
        }
      }, err => {
        console.log(err);
      }
    );
  }

  public getParticipants() {
    this.loadingParticipants = true;
    const query = {
      'relInclude': 'calendarId',
      'include': ['profiles']
    };
    let isCurrentUserParticipant = false;
    let currentUserParticipatingCalendar = '';
    this._collectionService.getParticipants(this.workshopId, query).subscribe(
      (response: any) => {
        this.allParticipants = response.json();
        for (const responseObj of response.json()) {
          if (this.calendarId && this.calendarId === responseObj.calendarId) {
            this.participants.push(responseObj);
          }
          if (this.calendarId === undefined && responseObj.id === this.userId) {
            // current user is a participant of this workshop
            isCurrentUserParticipant = true;
            currentUserParticipatingCalendar = responseObj.calendarId;
          }
        }
        if (isCurrentUserParticipant) {
          this.router.navigate(['workshop', this.workshopId, 'calendar', currentUserParticipatingCalendar]);
        }
        this.loadingParticipants = false;
      }, (err) => {
        console.log(err);
      }
    );
  }

  public hasUpvoted(upvotes) {
    let result = false;
    if (upvotes !== undefined) {
      upvotes.forEach(upvote => {
        if (upvote.peer !== undefined) {
          if (upvote.peer[0].id === this.userId) {
            result = true;
          }
        }
        else {
          result = true;
        }
      });
    }
    return result;
  }

  public isMyComment(comment) {
    return comment.peer[0].id === this.userId;
  }

  public hasReviewed(reviews) {
    let result = false;
    reviews.forEach(review => {
      if (review.peer[0].id === this.userId) {
        result = true;
      }
    });
    return result;
  }

  public isMyReview(review) {
    return review.peer[0].id === this.userId;
  }

  public hasCohortEnded() {
    const cohortEndDate = moment(this.currentCalendar.endDate);
    const currentDate = moment();
    return cohortEndDate.diff(currentDate) > 0;
  }

  public hasLiveCohort() {
    let result = false;
    this.workshop.calendars.forEach(calendar => {
      const cohortStartDate = moment(calendar.startDate);
      const cohortEndDate = moment(calendar.endDate);
      const currentMoment = moment();
      if (currentMoment.isBetween(cohortStartDate, cohortEndDate)) {
        this.liveCohort = calendar;
        result = true;
      } else {
        result = false;
      }
    });
    return result;
  }

  public hasUpcomingCohort() {
    let result = false;
    this.workshop.calendars.forEach(calendar => {
      const cohortStartDate = moment(calendar.startDate);
      const cohortEndDate = moment(calendar.endDate);
      const currentMoment = moment();
      if (cohortStartDate.diff(currentMoment, 'seconds') > 0) {
        result = true;
      } else {
        result = false;
      }
    });
    return result;
  }

  public shareOnFb() {
    FB.ui({
      method: 'share'
    }, function (response) {
      // Debug response (optional)
      console.log(response);
    });
  }

  public shareOnTwitter() {
    // TODO twitter sharing code
  }

  public hasDatePassed(date) {
    const eventDate = moment(date);
    const currentDate = moment();
    return (this.calendarId !== undefined && eventDate.diff(currentDate, 'seconds') < 0);
  }

  public setContentViews(contents) {
    contents.forEach(content => {
      if (content.type !== 'project' && content.views !== undefined) {
        const thisUserView = [];
        let totalUserViewTime = 0;
        content.views.forEach(view => {
          if (view.peer[0].id === this.userId && view.endTime !== undefined) {
            thisUserView.push(view);
            const startTime = moment(view.startTime);
            const endTime = moment(view.endTime);
            console.log(endTime.toString());
            const thisViewTime = endTime.diff(startTime);
            console.log(thisViewTime);
            totalUserViewTime += thisViewTime;
          }
        });
        content.views = thisUserView;
        content.totalUserViewTime = Math.floor(totalUserViewTime / 60000) + ' minutes';
        content.isViewTimeHidden = true;
      }
      else if (content.type === 'project' && content.submissions !== undefined) {
        const thisUserView = [];
        let totalUserViewTime;
        content.submissions.forEach(submission => {
          if (submission.peer[0].id === this.userId) {
            thisUserView.push(submission);
            const startTime = moment(submission.createdAt);
            const endTime = moment();
            totalUserViewTime = startTime.from(endTime);
            content.views = thisUserView;
            content.totalUserViewTime = totalUserViewTime;
            content.isViewTimeHidden = true;
          }
        });
      }
    });
  }

  public showViewTime(content) {
    content.isViewTimeHidden = false;
  }

  public hideViewTime(content) {
    content.isViewTimeHidden = true;
  }

  /**
   * joinLiveSession
   */
  public joinLiveSession() {
    const data = {
      roomName: this.workshopId,
      teacherId: this.workshop.owners[0].id
    };
    this.dialogsService.startLiveSession(data).subscribe(result => {

    });
  }

}
