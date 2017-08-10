import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import {
  URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import * as moment from 'moment';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../../_services/languagepicker/languagepicker.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AuthGuardService } from '../../_services/auth-guard/auth-guard.service';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';


import { StepEnum } from '../StepEnum';
import { AppConfig } from '../../app.config';

import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';

import { SideBarMenuItem } from '../../_services/left-sidebar/left-sidebar.service';
import _ from 'lodash';

@Component({
  selector: 'app-workshop-edit',
  templateUrl: './workshop-edit.component.html',
  styleUrls: ['./workshop-edit.component.scss']
})

export class WorkshopEditComponent implements OnInit {
  public sidebarFilePath = 'assets/menu/workshop-static-left-sidebar-menu.json';
  sidebarMenuItems;

  public interest1: FormGroup;
  public newTopic: FormGroup;
  public workshop: FormGroup;
  public selectedTopic: FormGroup;
  public timeline: FormGroup;
  public conditions: FormGroup;

  private workshopId: string;
  private workshopObject = {};
  // Set our default values
  public localState = { value: '' };
  public countries: any[];
  public languagesArray: any[];
  public userId: string;
  public selectedValues: string[] = [];

  public searchTopicURL = 'http://localhost:4000/api/search/topics/suggest?field=name&query=';
  public createTopicURL = 'http://localhost:3000/api/topics';
  public placeholderStringTopic = 'Search for a topic ';
  public maxTopicMsg = 'Choose max 3 related topics';


  public difficulties = [];
  public cancellationPolicies = [];
  public contentComplete = false;
  public currencies = [];
  public key;
  public maxTopics = 3;

  private options;

  profileImagePending: Boolean;
  workshopVideoPending: Boolean;
  workshopImage1Pending: Boolean;
  workshopImage2Pending: Boolean;

  public step = 1;
  public max = 14;
  public learnerType_array;
  public selectedLanguages = [];
  public suggestedTopics = [];
  public interests = [];
  public removedInterests = [];

  public days;

  // TypeScript public modifiers
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private config: AppConfig,
    public authenticationService: AuthenticationService,
    private languagePickerService: LanguagePickerService,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    public _collectionService: CollectionService,
    private mediaUploader: MediaUploaderService,
    private cookieUtilsService: CookieUtilsService,
    public requestHeaderService: RequestHeaderService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.workshopId = params['workshopId'];
      this.step = params['step'];
    });
    this.userId = cookieUtilsService.getValue('userId');
    this.options = requestHeaderService.getOptions();
  }

  public ngOnInit() {
    this.interest1 = new FormGroup({
      // interests: this._fb.array([])
    });

    this.newTopic = this._fb.group({
      topicName: ['', Validators.requiredTrue]
    });

    this.workshop = this._fb.group({
      // id: '',
      type: '',
      title: '',
      stage: '',
      language: this._fb.array([]),
      selectedLanguage: '',
      headline: '',
      description: '',
      difficultyLevel: '',
      prerequisites: '',
      maxSpots: '',
      videoUrl: '',
      imageUrls: this._fb.array([]),
      totalHours: '',
      price: '',
      currency: '',
      cancellationPolicy: '',
      ageLimit: '',
      aboutHost: '',
      notes: '',
      // isApproved: '',
      approvedBy: '',
      // isCanceled: '',
      canceledBy: '',
      // status: '',
      // createdAt: '',
      // updatedAt: ''
    });

    this.timeline = this._fb.group({
      calendar: this._fb.group({
        startDate: '',
        endDate: ''
      }),
      contentGroup: this._fb.group({
        itenary: this._fb.array([])
      })
    });

    this.conditions = this._fb.group({
      standards: '',
      terms: ''
    });

    this.selectedTopic = new FormGroup({});

    this.initializeFormFields();

    this.initializeWorkshop();

    this.initializeTimeLine();

  }

  private extractDate(dateString: string) {
    return dateString.split('T')[0];
  }
  private extractTime(dateString: string) {
    const time = dateString.split('T')[1];
    return time.split('.')[0];
  }

  private initializeTimeLine() {
    this.http.get(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar').map(
      (res: any) => {
        if (res.startDate) {
          res.startDate = this.extractDate(res.startDate);
          res.endDate = this.extractDate(res.endDate);
          this._collectionService.sanitize(res);
          this.timeline.controls.calendar.patchValue(res);
          this.initializeContentForm();
        }
      }
    ).subscribe();
  }

  public initializeContentForm() {
    const contentGroup = <FormGroup>this.timeline.controls.contentGroup;
    const itenary = <FormArray>contentGroup.controls.itenary;
    this.getContents((err, itenaries: any) => {
      if (err) {
        console.log(err);
      } else {
        for (const key in itenaries) {
          if (itenaries.hasOwnProperty(key)) {
            const itr: FormGroup = this.InitItenary();
            itr.controls.date.setValue(this.calculatedDate(this.timeline.value.calendar.startDate, key));
            for (const contentObj of itenaries[key]) {
              const contentForm: FormGroup = this.InitContent();
              this.assignFormValues(contentForm, contentObj);
              const contents = <FormArray>itr.controls.contents;
              contents.push(contentForm);
            }
            itenary.push(itr);
          }
        }
      }
    });
  }

  /**
   * assignFormValues
   */
  public assignFormValues(form: FormGroup, value: any) {
    for (const key in value) {
      if (value.hasOwnProperty(key) && form.controls[key]) {
        if (form.controls[key] instanceof FormGroup) {
          this.assignFormValues(<FormGroup>form.controls[key], value[key]);
          console.log(form.controls[key].value);
        } else {
          if (key === 'startTime' || key === 'endTime') {
            console.log(this.extractTime(value[key]));
            form.controls[key].setValue(this.extractTime(value[key]));
          } else if (key === 'startDay' || key === 'endDay') {
            form.controls[key].setValue(this.calculatedDate(this.timeline.value.calendar.startDate, value[key]));
          } else {
            form.controls[key].setValue(value[key]);
          }
        }
      } else {
        // console.log('Not Present ' + key);
      }
    }
  }

  public InitItenary() {
    return this._fb.group({
      contents: this._fb.array([]),
      date: ['']
    });
  }

  public InitContent() {
    return this._fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(10)]],
      type: [''],
      description: [''],
      supplementUrls: this._fb.array([]),
      requireRSVP: [''],
      itemsProvided: this._fb.array([]),
      notes: [''],
      imageUrl: [''],
      prerequisites: [''],
      schedule: this._fb.group({
        id: [''],
        startDay: [''],
        endDay: [''],
        startTime: [''],
        endTime: ['']
      }),
      pending: ['']
    });
  }

  public getContents(cb) {
    this.http.get(this.config.apiUrl + '/api/collections/' + this.workshopId + '/contents?filter={"include":"schedules"}').map(
      (res: any) => {
        const itenaries = {};
        for (const contentObj of res) {
          contentObj.schedule = contentObj.schedules[0];
          delete contentObj.schedules;
          if (itenaries.hasOwnProperty(contentObj.schedule.startDay)) {
            itenaries[contentObj.schedule.startDay].push(contentObj);
          } else {
            itenaries[contentObj.schedule.startDay] = [contentObj];
          }
        }
        cb(null, itenaries);
      }
    ).subscribe();
  }



  private initializeFormFields() {
    this.difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    this.cancellationPolicies = [{
      value: 1,
      text: '24 Hours'
    }, {
      value: 3,
      text: '3 Days'
    },
    {
      value: 7,
      text: '1 Week'
    }];

    this.currencies = ['USD', 'INR', 'GBP'];

    this.learnerType_array = {
      learner_type: [
        { id: 'auditory', display: 'Auditory' }
        , { id: 'visual', display: 'Visual' }
        , { id: 'read-write', display: 'Read & Write' }
        , { id: 'kinesthetic', display: 'Kinesthetic' }
      ]
    };

    this.placeholderStringTopic = 'Search for a topic or enter a new one';

    this.key = 'access_token';


    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);

    this.languagePickerService.getLanguages()
      .subscribe((languages) => this.languagesArray = languages);

    this.http.get(this.config.searchUrl + '/api/search/topics')
      .map((response: any) => {
        this.suggestedTopics = response.slice(0, 10);
      }).subscribe();

    this.profileImagePending = true;
    this.workshopVideoPending = true;
    this.workshopImage1Pending = true;
  }

  private initializeWorkshop() {
    if (this.workshopId) {
      this._collectionService.getCollectionDetails(this.workshopId)
        .subscribe(res => {
          this.initializeFormValues(res);
        },
        err => console.log('error'),
        () => console.log('Completed!'));
    } else {
      console.log('NO COLLECTION');
    }
  }

  public selected(event) {

    if (this.interests.length >= 3) {
      this.maxTopicMsg = 'You cannot select more than 3 topics. Please delete any existing one and then try to add.';
    }
    this.interests = event;
    this.suggestedTopics = event;
    this.suggestedTopics.map((obj) => {
      obj.checked = 'true';
      return obj;
    });
  }

  public removed(event) {

    if (this.removedInterests.length !== 0) {
      const topicArray = [];
      this.removedInterests.forEach((topic) => {
        /* this.http.put(this.config.apiUrl +  '/api/peers/'
            + this.userId + '/topics/rel/' + topic.id)
                  .map((response: Response) => {} ).subscribe();*/
        topicArray.push(topic.id);
      });
      if (topicArray.length !== 0) {
        this.http.delete(this.config.apiUrl + '/api/peers/' + this.userId + '/topics/rel/' + topicArray, this.options)
          .map((response) => { console.log(response); }).subscribe();
      }
    }
  }

  public daysCollection(event) {
    this.days = event;
    this.sidebarMenuItems[2]['submenu'] = [];
    this.days.controls.forEach(function (item, index) {
      const index2 = +index + 1;
      this.sidebarMenuItems[2]['submenu'].push({
        'title': 'Day ' + index2,
        'step': 13 + '_' + index2,
        'active': false,
        'visible': true
      });
    }, this);
  }



  public getMenuArray(event) {
    this.sidebarMenuItems = event;
  }


  private initializeFormValues(data) {
    data = this._collectionService.sanitize(data);
    for (const property in data) {
      if (data.hasOwnProperty(property)) {
        if (property === 'language') {
          this.workshop.controls.selectedLanguage.patchValue(data.language[0]);
        }
        this.workshop.controls[property].patchValue(data[property]);

      }
    }
  }

  initAddress() {
    // initialize our address
    return this._fb.group({
      street: ['', Validators.required],
      postcode: ['']
    });
  }
  public workshopStepUpdate() {
    if (this.workshop.value.stage < this.step) {
      this.workshop.patchValue({
        'stage': this.step
      });
    }

  }

  public addUrl(value: String) {
    const control = <FormArray>this.workshop.controls['imageUrls'];
    this.workshopImage1Pending = false;
    control.push(new FormControl(value));
    console.log(this.workshop.controls['imageUrls'].value);
  }

  uploadVideo(event) {
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.workshop.controls['videoUrl'].setValue(this.config.apiUrl + responseObj.url);
        console.log(this.workshop.controls['videoUrl'].value);

        this.workshopVideoPending = false;
      }).subscribe();
    }
  }

  uploadImages(event) {
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.addUrl(responseObj.url);
      }).subscribe();
    }
    this.workshopImage1Pending = false;
  }

  public changeInterests(topic: any) {
    const index = this.interests.indexOf(topic);
    if (index > -1) {
      this.interests.splice(index, 1); // If the user currently uses this topic, remove it.
    } else {
      this.interests.push(topic); // Otherwise add this topic.
    }
  }

  public submitWorkshop(data) {
    const lang = <FormArray>this.workshop.controls.language;
    lang.removeAt(0);
    lang.push(this._fb.control(data.value.selectedLanguage));

    const body = data.value;
    delete body.selectedLanguage;

    this._collectionService.patchCollection(this.workshopId, body).map(
      (response) => {
        this.step++;
        this.workshopStepUpdate();
        this.router.navigate(['editWorkshop', this.workshopId, this.step]);
      }).subscribe();
  }

  /**
   * numberOfdays
  */
  public numberOfdays(currentDate, startDate) {
    const current = moment(currentDate);
    const start = moment(startDate);
    return current.diff(start, 'days');
  }

  /**
   * calculatedDate
  currenDate,day */
  public calculatedDate(currenDate, day) {
    const current = moment(currenDate);
    current.add(day, 'days');
    return current.format('YYYY-MM-DD');
  }

  public submitTimeline(data: FormGroup) {
    const body = data.value.calendar;
    if (body.startDate && body.endDate) {
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body, this.options)
        .map((response) => {
          this.step++;
          this.workshopStepUpdate();
          this.router.navigate(['editWorkshop', this.workshopId, this.step]);
        })
        .subscribe();
    } else {
      console.log('Enter Date!');
    }


  }

  public submitInterests() {
    let body = {};
    const topicArray = [];
    this.interests.forEach((topic) => {
      /* this.http.put(this.config.apiUrl +  '/api/peers/'
          + this.userId + '/topics/rel/' + topic.id)
                .map((response: Response) => {} ).subscribe();*/
      topicArray.push(topic.id);
    });
    body = {
      'targetIds': topicArray
    };
    if (topicArray.length !== 0) {
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/topics/rel', body)
        .map((response) => {
          this.step++;
          this.workshopStepUpdate();
          this.router.navigate(['editWorkshop', this.workshopId, this.step]);
        }).subscribe();
    }
  }

  /**
   * goto(toggleStep)  */
  public goto(toggleStep) {
    this.step = toggleStep;
    this.router.navigate(['editWorkshop', this.workshopId, +toggleStep]);
  }


  submitForReview() {
    console.log('Submitted!');
    this.router.navigate(['workshop-console']);
  }

  saveandexit() {

    if (this.step == 12) {
      const data = this.timeline;
      const body = data.value.calendar;
      console.log(body);
      if (body.startDate && body.endDate) {
        this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body, this.options)
          .map((response) => {
            this.router.navigate(['workshop-console']);
          })
          .subscribe();
      } else {
        console.log('Enter Date!');
      }

    } else {
      const data = this.workshop;
      const lang = <FormArray>this.workshop.controls.language;
      lang.removeAt(0);
      lang.push(this._fb.control(data.value.selectedLanguage));
      const body = data.value;
      delete body.selectedLanguage;
      this._collectionService.patchCollection(this.workshopId, body).map(
        (response) => {
          this.router.navigate(['workshop-console']);
        }).subscribe();
    }
  }

  AddNewTopic(data, modal) {
    const body = {
      'name': data.value.topicName,
      'type': 'user'
    };
    let topic;
    this.http.post(this.config.apiUrl + '/api/topics', body)
      .map((res) => {
        topic = res;
        topic.checked = true;
        this.interests.push(topic);
        this.suggestedTopics = _.union(this.suggestedTopics, this.interests);
        modal.hide();
      })
      .subscribe();
  }

}
