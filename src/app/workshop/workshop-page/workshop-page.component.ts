import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AppConfig } from '../../app.config';
import * as moment from 'moment';
import _ from 'lodash';

@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss']
})
export class WorkshopPageComponent implements OnInit {

  public workshopId: string;
  public userId: string;
  public workshop: any;
  public itenaryArray = [];
  public calendarDisplay = {};
  public booked = false;
  public chatForm: FormGroup;
  public userType: string;
  public totalDuration: string;
  public modalContent: any;
  public topicFix: any;
  public messagingParticipant: any;
  public messageForm: FormGroup;
  public maxRating = 5;
  public userRating: number;
  public isReadonly = true;
  public noOfReviews = 4;

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieUtilsService: CookieUtilsService,
    private _collectionService: CollectionService,
    private config: AppConfig,
    private _fb: FormBuilder) {
    this.activatedRoute.params.subscribe(params => {
      this.workshopId = params['workshopId'];
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
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
      if (!this.userType) {
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
      console.log('Welcome ' + this.userType);

    }
  }
  private initializeWorkshop() {
    const query = {
      'include': [
        'topics',
        'calendars',
        { 'participants': [{ 'profiles': ['work'] }] },
        { 'owners': [{ 'profiles': ['work'] }] },
        { 'contents': ['schedules'] },
        'reviews'
      ]
    };

    if (this.workshopId) {
      this._collectionService.getCollectionDetail(this.workshopId, query)
        .subscribe(res => {
          this.workshop = res;

          this.parseCalendar(this.workshop);

          const contents = [];
          const itenariesObj = {};
          this.workshop.contents.forEach(contentObj => {
            contents.push(contentObj);
          });

          contents.forEach(contentObj => {
            if (itenariesObj.hasOwnProperty(contentObj.schedules[0].startDay)) {
              itenariesObj[contentObj.schedules[0].startDay].push(contentObj);
            } else {
              itenariesObj[contentObj.schedules[0].startDay] = [contentObj];
            }
          });
          for (const key in itenariesObj) {
            if (itenariesObj.hasOwnProperty(key)) {
              const eventDate = this.calculateDate(this.workshop.calendars[0].startDate, key);
              const itenary = {
                startDay: key,
                startDate: eventDate,
                contents: itenariesObj[key]
              };
              this.itenaryArray.push(itenary);
            }
          }

          this.itenaryArray.sort(function (a, b) {
            return parseFloat(a.startDay) - parseFloat(b.startDay);
          });
          console.log(this.workshop);

        },
        err => console.log('error'),
        () => {
          console.log('Completed!');
          this.initializeUserType();
          this.calculateTotalHours();
          this.fixTopics();
          this.calculateRating();
        });


    } else {
      console.log('NO COLLECTION');
    }
  }

  private calculateRating() {
    let reviewScore = 0;
    let totalScore = 0;
    for (const reviewObject of this.workshop.reviews) {
      reviewScore += reviewObject.score;
      totalScore += 5;
    }
    this.userRating = totalScore / reviewScore;
  }

  private fixTopics() {
    console.log(this.workshop.topics);
    this.topicFix = _.uniqBy(this.workshop.topics, 'id');
    console.log(this.topicFix);

  }

  private initializeForms() {
    this.chatForm = this._fb.group({
      message: ['', Validators.required],
      announce: ''
    });

    this.messageForm = this._fb.group({
      message: ['', Validators.required],
      sent: ''
    });
  }

  gotoEdit() {
    this.router.navigate(['workshop', this.workshopId, 'edit', 1]);
  }

  public parseCalendar(workshop: any) {
    if (workshop.calendars) {
      const startDate = moment(workshop.calendars[0].startDate);
      const endDate = moment(workshop.calendars[0].endDate);
      this.calendarDisplay['startDate'] = startDate.format('Do MMMM');
      this.calendarDisplay['endDate'] = endDate.format('Do MMMM');
    }
  }

  /**
   * changeDates
   */
  public changeDates() {
    this.router.navigate(['editWorkshop', this.workshopId, 13]);
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
    return tempMoment.format('Do MMMM');
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
   * openModal
content:any   */
  public openModal(content: any, viewOnlineContent: ModalDirective, viewVideoContent: ModalDirective, viewProjectContent: ModalDirective) {
    this.modalContent = content;
    switch (content.type) {
      case 'online':
        {
          viewOnlineContent.show();
          break;
        }
      case 'video':
        {
          viewVideoContent.show();
          break;
        }
      case 'project':
        {
          viewProjectContent.show();
          break;
        }
      default:
        break;
    }

  }

  /**
   * removeParticipant
   */
  public removeParticipant(participantId: string) {
    this._collectionService.removeParticipant(this.workshopId, participantId).subscribe((response) => {
      console.log('deleted');
      this.initializeWorkshop();
    });
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
      return false;
    }
  }

  /**
   * joinSession
content:any   */
  public joinSession(content: any) {
    console.log('Joining Session');
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
      return endMoment.fromNow();
    } else {
      return startMoment.toNow();
    }


  }

  /**
   * messageParticipant
   */
  public messageParticipant(messageDialog: ModalDirective, participant: any) {
    console.log(participant);
    this.messagingParticipant = participant;
    messageDialog.show();
  }

  /**
   * sendMessage
   */
  public sendMessage() {
    console.log(this.messageForm.value);
    this.messageForm.reset();
    console.log('sent');
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
   * getReadableDate
   */
  public getReadableDate(date: string) {
    return moment(date).format('Do MMMM');
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
}
