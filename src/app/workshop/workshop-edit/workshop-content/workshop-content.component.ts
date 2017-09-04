import {
  Component, Input, OnInit, forwardRef, ElementRef, Inject, EventEmitter
  , HostBinding, HostListener, Output
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import {
  Http, URLSearchParams, Headers, Response, BaseRequestOptions
  , RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { AppConfig } from '../../../app.config';
import { AuthenticationService } from '../../../_services/authentication/authentication.service';
import * as moment from 'moment';
import { RequestHeaderService } from '../../../_services/requestHeader/request-header.service';

@Component({
  selector: 'app-workshop-content',
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './workshop-content.component.html',
  styleUrls: ['./workshop-content.component.scss']

})

export class WorkshopContentComponent implements OnInit {
  @Input()
  public myForm: FormGroup;

  @Input()
  public collectionId: string;

  @Input()
  public calendar: any;

  @Output()
  days = new EventEmitter<any>();

  private options;
  constructor(
    public authenticationService: AuthenticationService,
    private http: Http, private config: AppConfig,
    private _fb: FormBuilder,
    private requestHeaders: RequestHeaderService
  ) {
    this.options = requestHeaders.getOptions();
  }

  ngOnInit() {
    this.myForm.addControl('itenary', this._fb.array([this.initItenary()]));
  }
  initItenary() {
    return this._fb.group({
      date: [null],
      contents: this._fb.array([])
    });
  }

  addItenary() {
    const itenaries = <FormArray>this.myForm.controls['itenary'];
    itenaries.push(this.initItenary());
    this.days.emit(itenaries);
  }

  removeItenary(i: number) {

    const itenaries = <FormArray>this.myForm.controls.itenary;
    const itenaryGroup = <FormGroup>itenaries.controls[i];
    const contents = <Array<any>>itenaryGroup.value.contents;

    let deleteIndex = 0;

    while (deleteIndex !== contents.length) {
      this.http.delete(this.config.apiUrl + '/api/contents/' + contents[deleteIndex].id, this.options)
        .map((response: Response) => {
          console.log(response);
        })
        .subscribe();
      deleteIndex++;
    }
    itenaries.removeAt(i);
    this.days.emit(itenaries);
  }

  save(myForm: FormGroup) {
    console.log(myForm.value);
  }
  /**
     * numberOfdays
    */
  public numberOfdays(currentDate, startDate) {
    const current = moment(currentDate);
    const start = moment(startDate);
    return current.diff(start, 'days');
  }

  saveTriggered(event, i) {
    console.log(this.myForm);
    if (event.action === 'add') {
      const itenaryObj = this.myForm.value.itenary[i];
      const scheduleDate = itenaryObj.date;
      const contentObj = _.cloneDeep(itenaryObj.contents[event.value]);
      const schedule = contentObj.schedule;
      delete schedule.id;
      delete contentObj.id;
      delete contentObj.schedule;
      delete contentObj.pending;
      if (contentObj.type === 'project' || contentObj.type === 'video') {
        const endDay = new Date(schedule.endDay);
        schedule.endDay = endDay;
        schedule.startTime = null;
        schedule.endTime = null;
      } else if (contentObj.type === 'online') {
        const startTimeArr = schedule.startTime.toString().split(':');
        const startHour = startTimeArr[0];
        const startMin = startTimeArr[1];
        schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);

        const endTimeArr = schedule.endTime.toString().split(':');
        const endHour = endTimeArr[0];
        const endMin = endTimeArr[1];
        schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);
      } else if (contentObj.type === 'video') {

      }

      schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
      schedule.endDay = 0;
      console.log(schedule);
      this.http.post(this.config.apiUrl + '/api/collections/' + this.collectionId + '/contents', contentObj, this.options)
        .map((response: Response) => {
          const contentId = response.json().id;
          const itenary = <FormArray>this.myForm.controls.itenary;
          const form = <FormGroup>itenary.controls[i];
          const contentsArray = <FormArray>form.controls.contents;
          const contentGroup = <FormGroup>contentsArray.controls[event.value];
          contentGroup.controls.id.setValue(contentId);

          this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/schedule', schedule, this.options)
            .map((resp: Response) => {
              if (resp.status === 200) {
                const Itenary = <FormArray>this.myForm.controls.itenary;
                const Form = <FormGroup>Itenary.controls[i];
                const ContentsArray = <FormArray>Form.controls.contents;
                const ContentGroup = <FormGroup>ContentsArray.controls[event.value];
                ContentGroup.controls.pending.setValue(false);
              }
              console.log(response);
            })
            .subscribe();
        })
        .subscribe();

    } else if (event.action === 'update') {
      const itenary = <FormArray>this.myForm.controls.itenary;
      const form = <FormGroup>itenary.controls[i];
      const contentsArray = <FormArray>form.controls.contents;
      const contentGroup = <FormGroup>contentsArray.controls[event.value];
      contentGroup.controls.pending.setValue(true);

      const itenaryObj = this.myForm.value.itenary[i];
      const scheduleDate = itenaryObj.date;
      const contentObj = _.cloneDeep(itenaryObj.contents[event.value]);
      const schedule = contentObj.schedule;
      delete schedule.id;
      const contentId = contentObj.id;
      delete contentObj.id;
      delete contentObj.schedule;
      delete contentObj.pending;
      if (contentObj.type === 'project') {
        const endDay = new Date(schedule.endDay);
        schedule.endDay = endDay;
      }
      if (contentObj.type === 'online') {

      }
      schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
      schedule.endDay = 0;
      if (schedule.startTime === '') {
        schedule.startTime = new Date(0, 0, 0, 1, 0, 0, 0);
      } else {
        const startTimeArr = schedule.startTime.toString().split(':');
        const startHour = startTimeArr[0];
        const startMin = startTimeArr[1];
        schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);
      }
      if (schedule.endTime === '') {
        schedule.endTime = new Date(0, 0, 0, 23, 0, 0, 0);
      }
      else {
        const endTimeArr = schedule.endTime.toString().split(':');
        const endHour = endTimeArr[0];
        const endMin = endTimeArr[1];
        schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);
      }
      console.log(contentId);
      console.log(schedule);
      this.http.patch(this.config.apiUrl + '/api/contents/' + contentId, contentObj, this.options)
        .map((response: Response) => {
          this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/schedule', schedule, this.options)
            .map((resp: Response) => {
              if (resp.status === 200) {
                contentGroup.controls.pending.setValue(false);
              }
              console.log(resp);
            })
            .subscribe();
        })
        .subscribe();
    } else if (event.action = 'delete') {
      const itenaryObj = this.myForm.value.itenary[i];
      const scheduleDate = itenaryObj.date;
      const contentObj = itenaryObj.contents[event.value];
      const contentId = contentObj.id;
      this.http.delete(this.config.apiUrl + '/api/contents/' + contentId, this.options)
        .map((response: Response) => {
          console.log(response);
          const itenary = <FormArray>this.myForm.controls.itenary;
          const form = <FormGroup>itenary.controls[i];
          const contentsArray = <FormArray>form.controls.contents;
          contentsArray.removeAt(event.value);
        })
        .subscribe();
    } else {
      console.log('unhandledEvent Triggered');
    }
  }

  getCalendarStartDate() {
    return new Date(this.calendar.startDate);
  }

  getCalendarEndDate() {
    return new Date(this.calendar.endDate);
  }

}
