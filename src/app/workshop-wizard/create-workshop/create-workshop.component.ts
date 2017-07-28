import 'rxjs/add/operator/switchMap';
import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { AuthenticationService } from "../../_services/authentication/authentication.service";
import { CountryPickerService } from "../../_services/countrypicker/countrypicker.service";
import { LanguagePickerService } from "../../_services/languagepicker/languagepicker.service";
import { CollectionService } from '../../_services/collection/collection.service';

import {
  Http, URLSearchParams, Headers, Response, BaseRequestOptions
  , RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { CookieService } from 'angular2-cookie/core';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
// import { Profile } from './interfaces/profile.interface';
import * as moment from 'moment';

@Component({
  selector: 'create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.scss']
})
export class CreateWorkshopComponent implements OnInit {
  //Getting workshop id from url
  private workshopId: string;
  private workshopObject: any;

  // Set our default values
  public localState = { value: '' };
  public countries: any[];
  public languagesArray: any[];
  public placeholderStringTopic = 'Search for a topic or enter a new one';
  // public profile: Profile;
  public userId: string;
  public profile: FormGroup;
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


  profileImagePending: Boolean;
  workshopVideoPending: Boolean;
  workshopImage1Pending: Boolean;
  workshopImage2Pending: Boolean;

  public step = 1;
  public max = 13;
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
    private http: Http, private config: AppConfig,
    public authenticationService: AuthenticationService,
    private languagePickerService: LanguagePickerService,
    private _cookieService: CookieService,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    public _collectionService: CollectionService
  ) {
    this.getCookieValue('userId');
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
    this.languagePickerService.getLanguages()
      .subscribe((languages) => this.languagesArray = languages);
    // this.getProfile();
    this.getTopics();

  }

  public selected(event) {
    this.selectedLanguages = event;
  }

  public ngOnInit() {

    this.profileImagePending = true;
    this.workshopVideoPending = true;
    this.workshopImage1Pending = true;
    this.workshopImage2Pending = true;
    this.profile = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      picture_url: new FormControl(''),
      headline: new FormControl(''),
      languages: new FormArray([
        new FormControl('')
      ]),
      location: new FormControl(''),
      experience_type: new FormControl(''),
      // learner_type: new FormControl(''),
      learner_type: new FormArray([]),
      // this.learnerType_array.learner_type.map(type => new FormControl(type))
      portfolio_url: new FormControl(''),
      is_teacher: new FormControl('false'),
      description: new FormControl(''),
      education: new FormControl(''),
      work_experience: new FormControl(''),
      custom_url: new FormControl(''),
      profile_video: new FormControl('')
    });

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

    this.difficulties = ["Beginner", "Intermediate", "Advanced"];
    this.cancellationPolicies = [{
      value: 1,
      text: "24 Hours"
    }, {
      value: 3,
      text: "3 Days"
    },
    {
      value: 7,
      text: "1 Week"
    }];


    this.currencies = ["USD", "INR", "GBP"]

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.step) {
        this.step = params.step;
      }
    });

    this.contentGroup = new FormGroup({});
    this.activatedRoute.params.subscribe(params => {
        this.workshopId = params["id"];
    });
    if(!this.workshopId) {
      this.createWorkshop();
    }
    else {
      this.workshopObject = this._collectionService.getCollectionDetails(this.workshopId);
      setTimeout(this.assignWorkshop, 2000);
    }

    this.returnUrl = 'home';
  }

  assignWorkshop() {
    console.log(this.workshopObject);
    // this.workshop.setValue(workshopObject);
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
        "stage": this.step
      });
    }

  }

  public profileImageUploaded(event) {
    let file = event.src;
    let fileName = event.file.name;
    let fileType = event.file.type;
    let formData = new FormData();

    formData.append('file', event.file);

    this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
      .map((response: Response) => {
        let mediaResponse = response.json();
        this.profile.controls['picture_url'].setValue(mediaResponse.url);
        this.profileImagePending = false;
      })
      .subscribe(); // data => console.log('response', data)
  }

  profileImageRemoved(event) {
    this.profile.controls['picture_url'].reset();
    this.profileImagePending = true;
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
    let file = event.src;
    let fileName = event.file.name;
    let fileType = event.file.type;
    let formData = new FormData();
    formData.append('file', event.file);
    this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
      .map((response: Response) => {
        let mediaResponse = response.json();
        this.addUrl(mediaResponse.url);
      })
      .subscribe(); // data => console.log('response', data)
  }

  workshopVideoUploaded(event) {
    let file = event.src;
    let fileName = event.file.name;
    let fileType = event.file.type;
    let formData = new FormData();
    formData.append('file', event.file);
    this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
      .map((response: Response) => {
        let mediaResponse = response.json();
        this.workshop.controls['videoUrl'].setValue(mediaResponse.url);
        this.workshopVideoPending = false;
      })
      .subscribe(); // data => console.log('response', data)
  }


  public changeLearnerType(type: any) {
    let currentTypeControls: FormArray = this.profile.get('learner_type') as FormArray;
    let index = currentTypeControls.value.indexOf(type);
    if (index > -1) {
      currentTypeControls.removeAt(index);
    } else {
      currentTypeControls.push(new FormControl(type));
    } // Otherwise add this type.
  }

  public changeInterests(topic: any) {
    let index = this.interests.indexOf(topic);
    if (index > -1) {
      this.interests.splice(index, 1); // If the user currently uses this topic, remove it.
    } else {
      this.interests.push(topic); // Otherwise add this topic.
    }
  }

  // languages = this.profile._value.languages.split(',');
  public submitProfile(event) {
    let body = this.profile.value;
    let learner_Type;
    let languages;
    learner_Type = this.profile.value.learner_type.map((type) => type.id);
    // body.languages = languages;
    body.languages = this.selectedLanguages;
    body.learner_type = learner_Type;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    if (this.step < 3) {
      this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId + '/profile', body, options)
        .map((response: Response) => {
          this.step++;
          this.workshopStepUpdate()
        })
        .subscribe();
    }
  }



  /**
   * createWorkshop
   */
  public createWorkshop() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = {
      "type": "workshop"
    };
    this.http.post(this.config.apiUrl + '/api/peers/' + this.userId + '/collections', body, options)
      .map((response: Response) => {
        this.workshopId = response.json().id;
      })
      .subscribe();

  }

  public submitWorkshop(data) {
    var body = data.value;
    var currentLanguage = body.language;
    body.language = [currentLanguage];
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId, body, options)
      .map((response: Response) => {
        this.step++;
        this.workshopStepUpdate()
      })
      .subscribe();
  }



  /**
   * numberOfdays
  */
  public numberOfdays(currentDate, startDate) {
    let current = moment(currentDate);
    let start = moment(startDate);
    return current.diff(start, 'days');
  }

  public submitTimeline(data: FormGroup) {
    var body = data.value.calendar;
    if (body.startDate && body.endDate) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers, withCredentials: true });
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body, options)
        .map((response: Response) => {
          this.step++;
          this.workshopStepUpdate();
        })
        .subscribe();
    } else {
      console.log("Enter Date!");
    }


  }

  public submitInterests(interests) {
    let topicArray = [];
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
    this.step++;

  }

  private getCookieValue(key: string) {
    let cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
    this.userId = cookieValue[1];
    return this.userId;
  }

  private getProfile() {
    let reqObject = { where: { userId: this.getCookieValue('userId') } };
    return this.http.get(this.config.apiUrl + '/api/profiles?filter='
      + encodeURIComponent(JSON.stringify(reqObject)))
      .map((response: Response) => {
        this.profile.controls['id'].setValue(response.json()[0].id);
      }).subscribe(); // data => console.log('response', data)
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
  }


  submitForReview() {
    console.log("Submitted!");

    this.router.navigate([this.returnUrl]);

  }

}
