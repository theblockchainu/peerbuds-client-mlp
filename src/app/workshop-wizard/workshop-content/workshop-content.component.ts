import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import {
  Http, URLSearchParams, Headers, Response, BaseRequestOptions
  , RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import * as moment from 'moment';


@Component({
  selector: 'workshop-content',
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './workshop-content.component.html',
  styleUrls: ['./workshop-content.component.scss']

})

export class WorkshopContentComponent implements OnInit {
  @Input("itenary")
  public myForm: FormGroup;

  @Input("collectionId")
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
    this.myForm.addControl("itenary", this._fb.array([this.initItenary()]));
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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    const itenaries = <FormArray>this.myForm.controls.itenary;
    const itenaryGroup = <FormGroup>itenaries.controls[i];
    const contents = <Array<any>>itenaryGroup.value.contents;

    let deleteIndex = 0;

    while (deleteIndex != contents.length) {

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
    let current = moment(currentDate);
    let start = moment(startDate);
    return current.diff(start, 'days');
  }

  saveTriggered(event, i) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    if (event.action == "add") {
      let itenaryObj = this.myForm.value.itenary[i];
      let scheduleDate = itenaryObj.date;
      let contentObj = _.cloneDeep(itenaryObj.contents[event.value]);
      let schedule = contentObj.schedule;
      delete contentObj.id;
      delete contentObj.schedule;
      delete contentObj.pending;

      if (contentObj.type == "project") {
        let endDay = new Date(schedule.endDay);
        schedule.endDay = endDay;
      } if (contentObj.type = "online") {
        let startTimeArr = schedule.startTime.toString().split(':');
        let startHour = startTimeArr[0];
        let startMin = startTimeArr[1];
        schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);

        let endTimeArr = schedule.endTime.toString().split(':');
        let endHour = endTimeArr[0];
        let endMin = endTimeArr[1];
        schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);
      }
      schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
      schedule.endDay = 0;
      console.log(schedule);
      this.http.post(this.config.apiUrl + '/api/collections/' + this.collectionId + '/contents', contentObj, options)
        .map((response: Response) => {
          let contentId = response.json().id;
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
        })
        .subscribe();

    } else if (event.action == "update") {
      const itenary = <FormArray>this.myForm.controls.itenary;
      const form = <FormGroup>itenary.controls[i];
      const contentsArray = <FormArray>form.controls.contents;
      const contentGroup = <FormGroup>contentsArray.controls[event.value];
      contentGroup.controls.pending.setValue(true);

      let itenaryObj = this.myForm.value.itenary[i];
      let scheduleDate = itenaryObj.date;
      let contentObj = _.cloneDeep(itenaryObj.contents[event.value]);
      let schedule = contentObj.schedule;
      let contentId = contentObj.id;
      delete contentObj.id;
      delete contentObj.schedule;
      delete contentObj.pending;

      if (contentObj.type == "project") {
        let endDay = new Date(schedule.endDay);
        schedule.endDay = endDay;
      } if (contentObj.type = "online") {
        let startTimeArr = schedule.startTime.toString().split(':');
        let startHour = startTimeArr[0];
        let startMin = startTimeArr[1];
        schedule.startTime = new Date(0, 0, 0, startHour, startMin, 0, 0);

        let endTimeArr = schedule.endTime.toString().split(':');
        let endHour = endTimeArr[0];
        let endMin = endTimeArr[1];
        schedule.endTime = new Date(0, 0, 0, endHour, endMin, 0, 0);
      }
      schedule.startDay = this.numberOfdays(scheduleDate, this.calendar.startDate);
      schedule.endDay = 0;
      console.log(schedule);
      this.http.patch(this.config.apiUrl + '/api/contents/' + contentId, contentObj, options)
        .map((response: Response) => {
          this.http.patch(this.config.apiUrl + '/api/contents/' + contentId + '/schedule', schedule, options)
            .map((response: Response) => {
              if (response.status == 200) {
                contentGroup.controls.pending.setValue(false);
              }
              console.log(response);
            })
            .subscribe();
        })
        .subscribe();
    } else if (event.action = "delete") {
      const itenaryObj = this.myForm.value.itenary[i];
      const scheduleDate = itenaryObj.date;
      const contentObj = itenaryObj.contents[event.value];
      let contentId = contentObj.id;
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
      console.log("unhandledEvent Triggered");
    }
  }

}
