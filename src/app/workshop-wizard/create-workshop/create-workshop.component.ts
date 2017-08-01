import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../../_services/languagepicker/languagepicker.service';
import { CollectionService } from '../../_services/collection/collection.service';
import { AuthGuardService } from '../../_services/auth-guard/auth-guard.service';
import { StepEnum } from '../StepEnum';

import {
  Http, URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { CookieService } from 'angular2-cookie/core';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';
import * as moment from 'moment';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss']
})

export class CreateWorkshopComponent implements OnInit {
  // Getting workshop id from url
  private workshopId: string;
  private workshopObject = {};

  // Set our default values
  public localState = { value: '' };
  public countries: any[];
  public languagesArray: any[];
  public placeholderStringTopic = 'Search for a topic or enter a new one';
  public userId: string;
  public interest1: FormGroup;
  public workshop: FormGroup;
  public selectedTopic: FormGroup;
  public key = 'access_token';
  public timeline: FormGroup;
  public returnUrl: string;

  public contentGroup: FormGroup;

  public difficulties = [];
  public cancellationPolicies = [];
  public contentComplete = false;
  public currencies = [];

  private options;

  profileImagePending: Boolean;
  workshopVideoPending: Boolean;
  workshopImage1Pending: Boolean;
  workshopImage2Pending: Boolean;

  public step = 0;
  public max = 11;
  public learnerType_array = {
    learner_type: [{ id: 'auditory', display: 'Auditory' }
      , { id: 'visual', display: 'Visual' }
      , { id: 'read-write', display: 'Read & Write' }
      , { id: 'kinesthetic', display: 'Kinesthetic' }]
  };
  public selectedLanguages = [];
  public suggestedTopics = [];
  public interests = [];

  // TypeScript public modifiers
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private config: AppConfig,
    public authenticationService: AuthenticationService,
    private languagePickerService: LanguagePickerService,
    private _cookieService: CookieService,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    public _collectionService: CollectionService,
    public requestHeaderService: RequestHeaderService,
    private mediaUploaderService: MediaUploaderService
  ) {
    this.getCookieValue('userId');
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
    this.languagePickerService.getLanguages()
      .subscribe((languages) => this.languagesArray = languages);
    // this.getProfile();
    this.getTopics();
    this.activatedRoute.params.subscribe(params => {
      this.workshopId = params['id'];
    });
    this.options = requestHeaderService.getOptions();
  }

  public selected(event) {
    this.selectedLanguages = event;
  }
  public ngOnInit() {
    this.activatedRoute.params.subscribe((params: { step: string }) => {
      // this.step = StepEnum[params.step];
    });
    /*if(!this.currentStep) {
      //handle error when user is entering an incorrect step.
    }*/

    this.profileImagePending = true;
    this.workshopVideoPending = true;
    this.workshopImage1Pending = true;
    this.workshopImage2Pending = true;
    this.interest1 = new FormGroup({});

    this.workshop = this._fb.group({
      language: '',
      stage: '',
      title: '',
      headline: '',
      description: '',
      difficultyLevel: '',
      notes: '',
      maxSpots: '',
      imageUrls: this._fb.array([]),
      videoUrl: '',
      repeatFrequency: '',
      repeatPeriod: '',
      totalHours: '',
      repeatUntil: '',
      price: '',
      currency: '',
      cancellationPolicy: '',
      ageLimit: '',
      aboutHost: ''
    });

    this.timeline = this._fb.group({
      calendar: this._fb.group({
        startDate: '',
        endDate: ''
      }),
      contentGroup: this._fb.group({})
    });



    this.selectedTopic = new FormGroup({});

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

    this.contentGroup = new FormGroup({});

    if (!this.workshopId) {
      this.createWorkshop();
    } else {
      this._collectionService.getCollectionDetails(this.workshopId).subscribe(res => this.assignWorkshop(res),
        err => console.log('error'),
        () => console.log('Completed!'));
    }

    this.returnUrl = 'home';
  }

  private assignWorkshop(data) {
    console.log(data);
    delete data.id;
    delete data.type;
    delete data.prerequisites;
    const languageArray = data.language;
    data.language = languageArray[0];
    delete data.imageUrls;
    data.imageUrls = [];
    delete data.created;
    delete data.modified;
    delete data.createdAt;
    delete data.updatedAt;
    console.log(data);
    this.workshopObject = data;
    /*setTimeout(()=>{
        this.workshop.setValue(data);
   },3000);*/
    this.workshop.setValue(data);
    this.step = data.stage;
    this.router.navigate(['createWorkshop', this.workshopId, this.step]);

  }

  // public ngAfterContentChecked() {
  //   // console.log(this.workshopObject);
  //   // this.workshop.setValue(this.workshopObject);
  // }

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
    // push the value from stepTextArea to array
    switch (control.length) {
      case 0:
        this.workshopImage1Pending = false;
        break;
      case 1:
        this.workshopImage2Pending = false;
        break;
      default:
        break;
    }
    this.workshopImage1Pending = false;
    control.push(new FormControl(value));
  }

  workshopImageUploaded(event) {
    const file = event.src;
    const fileName = event.file.name;
    const fileType = event.file.type;
    this.mediaUploaderService.upload(file)
      .map((mediaResponse: Response) => {
        this.addUrl(mediaResponse.url);
      })
      .subscribe();
  }

  workshopVideoUploaded(event) {
    const file = event.src;
    const fileName = event.file.name;
    const fileType = event.file.type;
    this.mediaUploaderService.upload(file)
      .map((mediaResponse: Response) => {
        this.workshop.controls['videoUrl'].setValue(mediaResponse.url);
        this.workshopVideoPending = false;
      })
      .subscribe();
  }


  public changeInterests(topic: any) {
    const index = this.interests.indexOf(topic);
    if (index > -1) {
      this.interests.splice(index, 1); // If the user currently uses this topic, remove it.
    } else {
      this.interests.push(topic); // Otherwise add this topic.
    }
  }
  /**
   * createWorkshop
   */
  public createWorkshop() {
    const body = {
      'type': 'workshop'
    };
    this.http.post(this.config.apiUrl + '/api/peers/' + this.userId + '/collections', body, this.options)
      .map((response: Response) => {
        this.workshopId = response.json().id;
      })
      .subscribe();

  }

  public submitWorkshop(data) {
    const body = data.value;
    const currentLanguage = body.language;
    body.language = [currentLanguage];
    this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId, body, this.options)
      .map((response: Response) => {
        this.step++;
        this.workshopStepUpdate();
        this.router.navigate(['createWorkshop', this.workshopId, this.step]);
      })
      .subscribe();
  }



  /**
   * numberOfdays
  */
  public numberOfdays(currentDate, startDate) {
    const current = moment(currentDate);
    const start = moment(startDate);
    return current.diff(start, 'days');
  }

  public submitTimeline(data: FormGroup) {
    const body = data.value.calendar;
    if (body.startDate && body.endDate) {
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body, this.options)
        .map((response: Response) => {
          this.step++;
          this.workshopStepUpdate();
          this.router.navigate(['createWorkshop', this.workshopId, this.step]);
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

  private getCookieValue(key: string) {
    const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
    this.userId = cookieValue[1];
    return this.userId;
  }

  private getTopics() {
    return this.http.get(this.config.apiUrl + '/api/topics')
      .map((response: Response) => {
        this.suggestedTopics = response.json();
      }).subscribe(); // data => console.log('response', data)

  }

  /**
   * goto(toggleStep)  */
  public goto(toggleStep) {
    this.step = toggleStep;
    this.router.navigate(['createWorkshop', this.workshopId, +toggleStep]);
  }


  submitForReview() {
    console.log('Submitted!');
    this.returnUrl = 'workshop';
    this.router.navigate([this.returnUrl]);

  }

  saveandexit() {

    this.returnUrl = 'workshop';
    this.router.navigate([this.returnUrl]);
  }

}
