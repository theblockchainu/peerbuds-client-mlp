import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AppConfig } from '../../app.config';
import * as moment from 'moment';

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
        { 'owners': ['profiles'] },
        { 'contents': ['schedules'] }
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
        });


    } else {
      console.log('NO COLLECTION');
    }
  }

  private initializeForms() {
    this.chatForm = this._fb.group({
      message: ['', Validators.required],
      announce: ''
    });
  }

  gotoEdit() {
    this.router.navigate(['editWorkshop', this.workshopId, 1]);
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
      this.router.navigate(['workshop-console']);
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
        console.log(content.schedules[0].startTime + '  ' + content.schedules[0].endTime);
        const contentLength = moment.utc(endMoment.diff(startMoment)).format('HH');
        console.log(contentLength);
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
    console.log(this.modalContent);

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

}
