import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../../app.config';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import {Http, URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs} from '@angular/http';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'experience-content',
  templateUrl: './experience-content.component.html',
  styleUrls: ['./experience-content.component.scss']
})
export class ExperienceContentComponent implements OnInit {
  @Input('itenary')
  public myForm: FormGroup;

  @Input('collectionId')
  public collectionId: string;

  @Input()
  public calendar: any;

  constructor(
      public authenticationService: AuthenticationService,
      private http: Http, private config: AppConfig,
      private _fb: FormBuilder
  ) {
  }

  ngOnInit() {
      this.myForm.addControl('itenary', this._fb.array([this.initItenary()]));
  }

  initItenary() {
      return this._fb.group({
          date: [''],
          contents: this._fb.array([])
      });
  }

  addItenary() {
      const itenaries = <FormArray>this.myForm.controls['itenary'];
      itenaries.push(this.initItenary());
  }

  removeItenary(i: number) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const options = new RequestOptions({ headers: headers, withCredentials: true });

      const itenaries = <FormArray>this.myForm.controls.itenary;
      const itenaryGroup = <FormGroup>itenaries.controls[i];
      const contents = <Array<any>>itenaryGroup.value.contents;

      let deleteIndex = 0;

      while (deleteIndex !== contents.length) {

          this.http.delete(this.config.apiUrl + '/api/contents/' + contents[deleteIndex].id, options)
              .map((response: Response) => {
                  console.log(response);
              })
              .subscribe();
          deleteIndex++;
      }
      itenaries.removeAt(i);
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
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const options = new RequestOptions({ headers: headers, withCredentials: true });

      if (event.action === 'add') {
          const itenaryObj = this.myForm.value.itenary[i];
          const scheduleDate = itenaryObj.date;
          const contentObj = _.cloneDeep(itenaryObj.contents[event.value]);
          const schedule = contentObj.schedule;
          const location = contentObj.location;

          delete contentObj.id;
          delete contentObj.schedule;
          delete contentObj.pending;
          delete contentObj.location;


          const startTimeArr = schedule.startTime.toString().split(':');
          const startHour = startTimeArr[0];
          const startMin = startTimeArr[1];
          schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);

          const endTimeArr = schedule.endTime.toString().split(':');
          const endHour = endTimeArr[0];
          const endMin = endTimeArr[1];
          schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);


          schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
          schedule.endDay = 0;
          console.log(schedule);

          this.http.post(this.config.apiUrl + '/api/collections/' + this.collectionId + '/contents', contentObj, options)
              .map((response: Response) => {
                  const contentId = response.json().id;
                  const itenary = <FormArray>this.myForm.controls.itenary;
                  const form = <FormGroup>itenary.controls[i];
                  const contentsArray = <FormArray>form.controls.contents;
                  const contentGroup = <FormGroup>contentsArray.controls[event.value];
                  contentGroup.controls.id.setValue(contentId);

                  this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/schedule', schedule, options)
                      .map((response: Response) => {
                          if (response.status == 200) {
                              const itenary = <FormArray>this.myForm.controls.itenary;
                              const form = <FormGroup>itenary.controls[i];
                              const contentsArray = <FormArray>form.controls.contents;
                              const contentGroup = <FormGroup>contentsArray.controls[event.value];
                              contentGroup.controls.pending.setValue(false);
                          }
                          console.log(response);
                      })
                      .subscribe();

                  this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/location', location, options)
                      .map((response: Response) => {
                          if (response.status == 200) {
                              const itenary = <FormArray>this.myForm.controls.itenary;
                              const form = <FormGroup>itenary.controls[i];
                              const contentsArray = <FormArray>form.controls.contents;
                              const contentGroup = <FormGroup>contentsArray.controls[event.value];
                              contentGroup.controls.pending.setValue(false);
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
          const contentId = contentObj.id;
          const location = contentObj.location;

          delete contentObj.id;
          delete contentObj.schedule;
          delete contentObj.pending;
          delete contentObj.location;

          const startTimeArr = schedule.startTime.toString().split(':');
          const startHour = startTimeArr[0];
          const startMin = startTimeArr[1];
          schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);

          const endTimeArr = schedule.endTime.toString().split(':');
          const endHour = endTimeArr[0];
          const endMin = endTimeArr[1];
          schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);

          schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
          schedule.endDay = 0;
          console.log(schedule);


          this.http.patch(this.config.apiUrl + '/api/contents/' + contentId, contentObj, options)
              .map((response: Response) => {
                  this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/schedule', schedule, options)
                      .map((response: Response) => {
                          if (response.status === 200) {
                              contentGroup.controls.pending.setValue(false);
                          }
                          console.log(response);
                      })
                      .subscribe();
                  this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/location', location, options)
                      .map((response: Response) => {
                          if (response.status === 200) {
                              contentGroup.controls.pending.setValue(false);
                          }
                          console.log(response);
                      })
                      .subscribe();
              })
              .subscribe();
      } else if (event.action = 'delete') {
          const itenaryObj = this.myForm.value.itenary[i];
          const scheduleDate = itenaryObj.date;
          const contentObj = itenaryObj.contents[event.value];
          const contentId = contentObj.id;
          this.http.delete(this.config.apiUrl + '/api/contents/' + contentId, options)
              .map((response: Response) => {
                  console.log(response);
                  const itenary = <FormArray>this.myForm.controls.itenary;
                  const form = <FormGroup>itenary.controls[i];
                  const contentsArray = <FormArray>form.controls.contents;
                  contentsArray.removeAt(event.value);
              })
              .subscribe();
      }
      else {
          console.log('unhandledEvent Triggered');
      }
  }

}
