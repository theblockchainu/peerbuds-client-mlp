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
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishReplay';
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
  public selectedLanguages;
  public suggestedTopics = [];
  public interests = [];
  public removedInterests = [];
  public relTopics = [];

  public days;

  public _CANVAS;
  public _VIDEO;
  public _CTX;

  public urlForVideo;
  public urlForImages=[];

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

    console.log("Inside oninit workshop");
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
      description: [null,Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
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
      aboutHost: '',//[null,Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])],
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
    
    this._CANVAS = <HTMLCanvasElement> document.querySelector("#video-canvas");
    this._VIDEO = document.querySelector("#main-video");
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

    if(this.interests.length == 0) {
      this.http.get(this.config.searchUrl + '/api/search/topics')
        .map((response: any) => {
          this.suggestedTopics = response.slice(0, 10);
        }).subscribe();
    }
    else {
      this.suggestedTopics = this.interests;
    }

    this.profileImagePending = true;
    this.workshopVideoPending = true;
    this.workshopImage1Pending = true;
  }

  private initializeWorkshop() {
    console.log("Inside init workshop");
    // if (this.workshopId) {
    //   this._collectionService.getCollectionDetails(this.workshopId)
    //     .subscribe(res => {
    //       this.initializeFormValues(res);
    //     },
    //     err => console.log('error'),
    //     () => console.log('Completed!'));
    // } else {
    //   console.log('NO COLLECTION');
    // }
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
        .subscribe((res) => {
          console.log(res);
          
          this.initializeFormValues(res);

          //this.workshop = res;
          // this.parseCalendar(this.workshop);

          // const contents = [];
          // const itenariesObj = {};
          // this.workshop.contents.forEach(contentObj => {
          //   contents.push(contentObj);
          // });

          // contents.forEach(contentObj => {
          //   if (itenariesObj.hasOwnProperty(contentObj.schedules[0].startDay)) {
          //     itenariesObj[contentObj.schedules[0].startDay].push(contentObj);
          //   } else {
          //     itenariesObj[contentObj.schedules[0].startDay] = [contentObj];
          //   }
          // });
          // for (const key in itenariesObj) {
          //   if (itenariesObj.hasOwnProperty(key)) {
          //     const eventDate = this.calculateDate(this.workshop.calendars[0].startDate, key);
          //     const itenary = {
          //       startDay: key,
          //       startDate: eventDate,
          //       contents: itenariesObj[key]
          //     };
          //     this.itenaryArray.push(itenary);
          //   }
          // }

          // this.itenaryArray.sort(function (a, b) {
          //   return parseFloat(a.startDay) - parseFloat(b.startDay);
          // });
          // console.log(this.workshop);

        },
        err => console.log('error'),
        () => console.log('Completed!'));

    } else {
      console.log('NO COLLECTION');
    }
  }

  public languageChange(value) {
    console.log(value);
    this.selectedLanguages = value;;
    this.workshop.controls.selectedLanguage.setValue(value);
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
    let body = {};
    let options;
    this.removedInterests = event;
    if (this.removedInterests.length !== 0) {
      const topicArray = [];
      this.removedInterests.forEach((topic) => {
        topicArray.push(topic.id);
      });

      body = {
        'targetIds': topicArray
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      
      options = new RequestOptions({
        headers: headers,
        body: body
      })
      if (topicArray.length !== 0) {
        this.http.delete(this.config.apiUrl + '/api/collections/' + this.workshopId + '/topics/rel', options)
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


  private initializeFormValues(res) {
    // Topics
    this.relTopics = _.uniqBy(res.topics, 'id');
    this.interests = this.relTopics;
    if(this.interests) {
      this.suggestedTopics = this.interests;
    }
    // Language
    if(res.language.length > 0) {
      this.selectedLanguages = res.language[0];
      this.workshop.controls.selectedLanguage.patchValue(res.language[0]);
    }
    // aboutHost TBD
    this.workshop.controls.aboutHost.patchValue(res.aboutHost);

    // Title
    this.workshop.controls.title.patchValue(res.title);

    // Headline
    this.workshop.controls.headline.patchValue(res.headline);

    // Description
    this.workshop.controls.description.patchValue(res.description);

    // Difficulty Level
    this.workshop.controls.difficultyLevel.patchValue(res.difficultyLevel);

    // Notes
    this.workshop.controls.notes.patchValue(res.notes);

    //Seats
    this.workshop.controls.maxSpots.patchValue(res.maxSpots);

    //Photos and Videos
    this.workshop.controls['videoUrl'].setValue(res.videoUrl);
    this.urlForVideo = res.videoUrl;
    // <img src="{{config.apiUrl+content.imageUrl}}">
    this.workshop.controls['imageUrls'].patchValue(res.imageUrls);
    this.urlForImages = res.imageUrls;

    //Currency, Amount, Cancellation Policy
    this.workshop.controls.price.patchValue(res.price);
    this.workshop.controls.currency.patchValue(res.currency);
    this.workshop.controls.cancellationPolicy.patchValue(res.cancellationPolicy);
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
      this.mediaUploader.upload(file).map((responseObj: Response) => {debugger;

        this.workshop.controls['videoUrl'].setValue(responseObj.url);
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
          console.log(this.step);
          this.step++;
          console.log(this.step);
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
    let topicArray = [];
    this.interests.forEach((topic) => {
      topicArray.push(topic.id);
    });
    this.relTopics.forEach((topic) => {
      topicArray = _.without(topicArray,topic.id)
    });
    console.log(topicArray);
    body = {
      'targetIds': topicArray
    };

    if (topicArray.length !== 0) {
      // this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/topics/rel', body)
      //   .share()
      //   .map((response) => {
      //     this.step++;
      //     this.workshopStepUpdate();
      //     this.router.navigate(['editWorkshop', this.workshopId, this.step]);
      //   });
      // patchRequest.subscribe((res) => {
      //     this.step++;
      //     this.workshopStepUpdate();
      //     this.router.navigate(['editWorkshop', this.workshopId, this.step]);
      // })

      let observable: Rx.Observable<any>;
      observable = this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/topics/rel', body)
                            .map(response => response).publishReplay().refCount();
      observable.subscribe((res) => {
          this.step++;
          this.workshopStepUpdate();
          this.router.navigate(['editWorkshop', this.workshopId, this.step]);
      });
    }
    else {
          this.step++;
          this.workshopStepUpdate();
          this.router.navigate(['editWorkshop', this.workshopId, this.step]);
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
    let tempArray = [];
    tempArray = _.union(this.interests, tempArray);
    const body = {
      'name': data.value.topicName,
      'type': 'user'
    };
    let topic;
    this.http.post(this.config.apiUrl + '/api/topics', body)
      .map((res) => {
        topic = res;
        topic.checked = true;
        tempArray.push(topic);
        this.interests = _.union(this.interests, tempArray);
        console.log("CHanged");
        this.suggestedTopics = this.interests;
        modal.hide();
      })
      .subscribe();
  }


  uploadCanvasVideo(event) {
    // Validate whether MP4
    if(['video/'].indexOf(event.target.files[0].type) == -1) {
        alert('Error : Only Video allowed');
        return;
    }

    this._CTX = this._CANVAS.getContext("2d");
    // Hide upload button
   //  document.querySelector("#upload-button").style.display = 'none';

    // Object Url as the video source
    document.querySelector("#main-video source").setAttribute('src', URL.createObjectURL(event.target.files[0]));
    // Load the video and show it
    this._VIDEO.load();
    // this._VIDEO.style.display = 'inline';
    let self = this;

    //this._VIDEO.onloadedmetadata = function(e){
    this._VIDEO.addEventListener('loadedmetadata', function(e){
        setTimeout(() => self.getMetadata(), 1000);
        // self._CTX = self._CANVAS.getContext("2d");
        // self._CANVAS.width = 150;//this.videoWidth;
        // self._CANVAS.height = 100;//this.videoHeight;
        // self._CTX.drawImage(this, 0, 0, self._CANVAS.width, self._CANVAS.height);
      }, false);
    }

    getMetadata() {
      console.log(new Date());
      this._CANVAS.width = 150;//this.videoWidth;
      this._CANVAS.height = 100;//this.videoHeight;
      this._CTX.drawImage(this._VIDEO, 0, 0, this._CANVAS.width, this._CANVAS.height);

    }

    uploadImage1(event) {
      if (event.target.files == null || event.target.files == undefined) {
            document.write("This Browser has no support for HTML5 FileReader yet!");
            return false;
        }
 
        for (var i = 0; i < event.target.files.length; i++) {
            var file = event.target.files[i];
            var imageType = /image.*/;
 
            if (!file.type.match(imageType)) {
                continue;
 
            }
 
            var reader = new FileReader();
 
            if (reader != null) {
 
                reader.onload = this.GetThumbnail;
                reader.readAsDataURL(file);
            }
 
 
        }
    }

    GetThumbnail(e) {
        var myCan = document.createElement('canvas');
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
 
            myCan.id = "myTempCanvas";
            var tsize = 100;
            myCan.width = Number(tsize);
            myCan.height = Number(tsize);
            if (myCan.getContext) {
                var cntxt = myCan.getContext("2d");
                cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
                var dataURL = myCan.toDataURL();
 
 
                if (dataURL != null && dataURL != undefined) {
                    var nImg = document.createElement('img');
                    nImg.src = dataURL;
                    document.getElementById('image-holder').appendChild(nImg);
 
                }
                else
                    alert('unable to get context');
 
            }
 
        }
 
    }

    deleteFromContainer(fileUrl) {
      this.http.delete(this.config.apiUrl + fileUrl)
          .map((response) => { console.log(response); }).subscribe();
    }


}

