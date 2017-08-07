import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../../_services/languagepicker/languagepicker.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AuthGuardService } from '../../_services/auth-guard/auth-guard.service';
import { StepEnum } from '../StepEnum';

import {
  URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import * as moment from 'moment';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
@Component({
  selector: 'app-workshop-edit',
  templateUrl: './workshop-edit.component.html',
  styleUrls: ['./workshop-edit.component.scss']
})

export class WorkshopEditComponent implements OnInit {
  public interest1: FormGroup;
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
  public placeholderStringTopic;
  public userId: string;
  public selectedValues: string[] = [];


  public difficulties = [];
  public cancellationPolicies = [];
  public contentComplete = false;
  public currencies = [];
  public key;

  private options;

  profileImagePending: Boolean;
  workshopVideoPending: Boolean;
  workshopImage1Pending: Boolean;
  workshopImage2Pending: Boolean;

  public step = 0;
  public max = 12;
  public learnerType_array;
  public selectedLanguages = [];
  public suggestedTopics = [];
  public interests = [];

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
    private cookieUtilsService: CookieUtilsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.workshopId = params['workshopId'];
      this.step = params['step'];
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  public ngOnInit() {
    this.interest1 = new FormGroup({});

    this.workshop = this._fb.group({
      // id: '',
      type: '',
      title: '',
      stage: '',
      language: this._fb.array([]),
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

    console.log(this.timeline);

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
            itr.controls.date.setValue(this.claculatedDate(this.timeline.value.calendar.startDate, key));
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
            form.controls[key].setValue(this.claculatedDate(this.timeline.value.calendar.startDate, value[key]));
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
    this.http.get(this.config.apiUrl + '/api/collections/' + this.workshopId + '/contents?filter[include]=schedules').map(
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

    this.http.get(this.config.apiUrl + '/api/topics')
      .map((response: any) => {
        this.suggestedTopics = response;
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
    this.selectedLanguages = event;
  }

  private initializeFormValues(data) {
    data = this._collectionService.sanitize(data);
    for (const property in data) {
      if (data.hasOwnProperty(property)) {
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
  }

  uploadVideo(event) {
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.workshop.controls['videoUrl'].setValue(responseObj.url);
        this.workshopVideoPending = false;
      }).subscribe();
    }
  }

  uploadImages(event) {
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.addUrl(responseObj.url);
        this.workshopVideoPending = false;
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
    const body = data.value;
    const currentLanguage = body.language;
    body.language = [currentLanguage];
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
   * claculatedDate
  currenDate,day */
  public claculatedDate(currenDate, day) {
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

  public submitInterests(interests) {
    this.step++;
    const topicArray = [];
    this.interests.forEach((topic) => {
      /* this.http.put(this.config.apiUrl +  '/api/peers/'
          + this.userId + '/topics/rel/' + topic.id)
                .map((response: Response) => {} ).subscribe();*/
      topicArray.push(topic.id);
    });
    if (topicArray.length !== 0) {
      this.http.put(this.config.apiUrl + '/api/peers/' + this.userId
        + '/topics/rel/' + topicArray, {})
        .map((response: Response) => { }).subscribe();
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
    this.router.navigate(['workshop']);
  }

  saveandexit() {
    this.router.navigate(['workshop']);
  }

}
