import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { LanguagePickerService } from '../../_services/languagepicker/languagepicker.service';
import { CollectionService } from '../../_services/collection/collection.service';

import { AuthGuardService } from '../../_services/auth-guard/auth-guard.service';

import {
  Http, URLSearchParams, Headers, Response, BaseRequestOptions
  , RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { AppConfig } from '../../app.config';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
// import { Profile } from './interfaces/profile.interface';
import * as moment from 'moment';

@Component({
  selector: 'experience-create',
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./experience-create.component.scss'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './experience-create.component.html'
})
export class ExperienceCreateComponent implements OnInit {
  //Getting experience id from url
  private experienceObject = {};

  // Set our default values
  public localState = { value: '' };
  public countries: any[];
  public languagesArray: any[];
  public placeholderStringTopic = 'Search for a topic or enter a new one';
  // public profile: Profile;
  public userId: string;
  public profile: FormGroup;
  public interest1: FormGroup;
  public experience: FormGroup;
  public selectedTopic: FormGroup;
  public experienceId: string;
  public key = 'access_token';
  public timeline: FormGroup;
  public returnUrl: string;

  public contentGroup: FormGroup;

  public difficulties = [];
  public cancellationPolicies = [];
  public contentComplete = false;
  public currencies = [];


  profileImagePending: Boolean;
  experienceVideoPending: Boolean;
  experienceImage1Pending: Boolean;
  experienceImage2Pending: Boolean;

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
    public authenticationService: AuthenticationService,
    private http: Http, private config: AppConfig,
    private languagePickerService: LanguagePickerService,
    private _cookieService: CookieService,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    private activatedRoute: ActivatedRoute,
    public _collectionService: CollectionService,
    public router: Router,
    private mediaUploader: MediaUploaderService
  ) {
    this.getCookieValue('userId');
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
    this.languagePickerService.getLanguages()
      .subscribe((languages) => this.languagesArray = languages);
    this.getTopics();
    this.activatedRoute.params.subscribe(params => {
        this.experienceId = params["id"];
    });

  }

  public selected(event) {
    this.selectedLanguages = event;
  }

  public ngOnInit() {

    this.profileImagePending = true;
    this.experienceVideoPending = true;
    this.experienceImage1Pending = true;
    this.experienceImage2Pending = true;
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
      learner_type: new FormArray([]),
      portfolio_url: new FormControl(''),
      is_teacher: new FormControl('false'),
      description: new FormControl(''),
      education: new FormControl(''),
      work_experience: new FormControl(''),
      custom_url: new FormControl(''),
      profile_video: new FormControl('')
    });

    this.interest1 = new FormGroup({});

    this.experience = this._fb.group({
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
      contentGroup: this._fb.group({
      })
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

    if(!this.experienceId) {
      this.createExperience();
    }
    else {
      this._collectionService.getCollectionDetails(this.experienceId).subscribe(res => this.assignExperience(res),
            err => console.log("error"),
            () => console.log('Completed!'));
    }
  }
  private assignExperience(data) {
    console.log(data);
    delete data.id;
    delete data.type;
    delete data.prerequisites;
    let languageArray = data.language;
    let lang: string;
    if(languageArray.length != 0)
      lang = languageArray[0];
    else lang = '';
    data.language =  lang;
    delete data.imageUrls;
    data.imageUrls = [];
    delete data.created;
    delete data.modified;
    console.log(data);
    this.experienceObject = data;
      /*setTimeout(()=>{
          this.workshop.setValue(data);
     },3000);*/
    this.experience.setValue(data);
    this.step = data.stage;
    this.router.navigate(['createExperience', this.experienceId, this.step]);

  }

  initAddress() {
    // initialize our address
    return this._fb.group({
      street: ['', Validators.required],
      postcode: ['']
    });
  }
  public experienceStepUpdate() {
    if (this.experience.value.stage < this.step) {
      this.experience.patchValue({
        "stage": this.step
      });
    }

  }

  public profileImageUploaded(event) {
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.profile.controls['picture_url'].setValue(responseObj.url);
        this.profileImagePending = false;
      }).subscribe();
    }
  }

  profileImageRemoved(event) {
    this.profile.controls['picture_url'].reset();
    this.profileImagePending = true;
  }

  public addUrl(value: String) {
    const control = <FormArray>this.experience.controls['imageUrls'];
    // push the value from stepTextArea to array
    switch (control.length) {
      case 0:
        this.experienceImage1Pending = false;
        break;
      case 1:
        this.experienceImage2Pending = false;
        break;
      default:
        break;
    }
    this.experienceImage1Pending = false;
    control.push(new FormControl(value));
  }

  experienceImageUploaded(event) {
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.addUrl(responseObj.url);
      }).subscribe();
    }
  }

  experienceVideoUploaded(event) {
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.experience.controls['videoUrl'].setValue(responseObj.url);
        this.experienceVideoPending = false;
      }).subscribe();
    }
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

  // languages = this.profile.value.languages.split(',');
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
          this.experienceStepUpdate()
        })
        .subscribe();
    }
  }



  /**
   * createExperience
   */
  public createExperience() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = {
      "type": "experience"
    };
    this.http.post(this.config.apiUrl + '/api/peers/' + this.userId + '/collections', body, options)
      .map((response: Response) => {
        this.experienceId = response.json().id;
      })
      .subscribe();

  }

  public submitExperience(data) {
    var body = data.value;
    var currentLanguage = body.language;
    body.language = [currentLanguage];
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.http.patch(this.config.apiUrl + '/api/collections/' + this.experienceId, body, options)
      .map((response: Response) => {
        this.step++;
        this.experienceStepUpdate()
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
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.experienceId + '/calendar', body, options)
        .map((response: Response) => {
          this.step++;
          this.experienceStepUpdate();
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
    let cookie = this._cookieService.get(key);
    if(cookie) {
      let cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
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
    this.router.navigate(['createExperience', this.experienceId, this.step]);
  }


  submitForReview() {
    console.log("Submitted!");
    this.returnUrl = 'experience';
    this.router.navigate([this.returnUrl]);

  }

}
