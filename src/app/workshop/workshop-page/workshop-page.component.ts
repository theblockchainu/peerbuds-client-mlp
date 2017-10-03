import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
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


// import { CalendarComponent } from '../calendar-component/calendar-component.component';


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

import { DialogsService } from '../dialogs/dialog.service';

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
  public userType: string;
  public totalDuration: string;
  public calendarId: string;
  public userRating: number;

  public isReadonly = true;
  public noOfReviews = 2;
  private initialised = false;
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
  objectKeys = Object.keys;

  public view = 'month';

  public viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  public modalData: {
    action: string;
    event: CalendarEvent;
  };

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen = true;

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
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
      if (type !== 'cohort') {
          if (!this.eventsForTheDay.hasOwnProperty(calId)) {
              this.eventsForTheDay[calId] = [{
                  title: title,
                  color: event.color,
                  start: event.start,
                  end: event.end
              }];
          }
          else {
              this.eventsForTheDay[calId].push({
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

  // Calendar Ends

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilsService: CookieUtilsService,
    public _collectionService: CollectionService,
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
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.initialised = true;
    this.initializeWorkshop();
    this.initializeForms();
  }

  public parseTitle(title) {
    return title.split(':');
  }

  // Modal
  public editCalendar() {
    this.dialogsService
      .editCalendar({ id: this.workshopId, type: this.workshop.type, name: this.workshop.title }, this.workshop.contents, this.workshop.calendars, this.allItenaries, this.allParticipants, this.events, this.userId, this.workshop.calendars[0].startDate, this.workshop.calendars[0].endDate)
      .subscribe(res => this.result = res);
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
      console.log('Welcome ' + this.userType);

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
            title: 'Cohort ' + index + ':' + calendar.id + ':cohort',
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
            title: iterinary.contents[i].title + ':' + calendarId + ':content',
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
        { 'participants': [{ 'profiles': ['work'] }] },
        { 'owners': [{ 'profiles': ['work'] }] },
        { 'contents': ['schedules', { 'submissions': [{'upvotes': 'peer'}, { 'peer': 'profiles' } ] }] }
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
          console.log('Completed!');
          this.initializeUserType();
          this.calculateTotalHours();
          this.fixTopics();
          this.getReviews();
          this.getRecommendations();
          this.getParticipants();
          this.getDiscussions();
        });


    } else {
      console.log('NO COLLECTION');
    }
  }
  private getReviews() {
    let query = {};
    if (this.calendarId) {
        query = {'include': [
            {
                'peer': ['profiles']
            }],
            'where': {'and': [{'collectionId': this.workshopId},{'collectionCalendarId': this.calendarId}]}
        };
    }
    else {
        query = {'include': [
            {
                'peer': ['profiles']
            }],
            'where': {'collectionId': this.workshopId}
        };
    }
    this._collectionService.getReviews(this.workshop.owners[0].id, query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
        this.reviews = response;
        this.userRating = this._collectionService.calculateRating(this.reviews);
      }
    });
  }

  private getDiscussions() {
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
      data: {itineraries: this.allItenaries, mode: 'chooseDate', participants: this.allParticipants, userType: this.userType}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['workshop', this.workshopId, 'calendar', result]);
      }
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
      content.isLive = true;
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
    if (this.noOfReviews === 2) {
      this.noOfReviews = 100;
    } else {
      this.noOfReviews = 2;
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
            width: '50vw',
            height: '90wh'
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
            width: '50vw',
            height: '90wh'
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
            width: '50vw',
            height: '90wh'
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
      'limit': 5,
      'where': {'id': {'neq': this.workshopId}}
    };
    this._collectionService.getRecommendations(query).subscribe(
      (response: any) => {
        for (const responseObj of response.json()) {
          if (this.workshopId !== responseObj.id) {
            responseObj.rating = this._collectionService.calculateRating(responseObj.reviews);
            this.recommendations.collections.push(responseObj);
          }
        }
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
      data: {itineraries: this.allItenaries, mode: 'chooseDate', participants: this.allParticipants, userType: this.userType}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.userId) {
          this.joinWorkshop(result);
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
   * handleRate
   */
  public handleRate(event) {
    this.reviewForm = this._fb.group({
      description: '',
      like: '',
      score: '',
      collectionId: this.workshopId,
      collectionCalendarId: this.calendarId,
    });
    this.reviewForm.controls['score'].setValue(event.value);
  }

  /**
   * postReview
   */
  public postReview() {
    this._collectionService.postReview(this.workshop.owners[0].id, this.reviewForm.value).subscribe(
      result => {
        if (result) {
          this.getReviews();
          delete this.reviewForm;
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
          }, (err) => {
              console.log(err);
          }
      );
  }
}
