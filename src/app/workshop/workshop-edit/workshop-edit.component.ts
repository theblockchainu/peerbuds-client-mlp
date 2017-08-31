import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
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
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';
import _ from 'lodash';
import {MdDialog} from '@angular/material';
import {WorkshopSubmitDialogComponent} from './workshop-submit-dialog/workshop-submit-dialog.component';
import {WorkshopCloneDialogComponent} from './workshop-clone-dialog/workshop-clone-dialog.component';
import {LeftSidebarService} from '../../_services/left-sidebar/left-sidebar.service';


@Component({
  selector: 'app-workshop-edit',
  templateUrl: './workshop-edit.component.html',
  styleUrls: ['./workshop-edit.component.scss']
})

export class WorkshopEditComponent implements OnInit {
  public sidebarFilePath = 'assets/menu/workshop-static-left-sidebar-menu.json';
  sidebarMenuItems;
  public itenariesForMenu = [];

  public interest1: FormGroup;
  public newTopic: FormGroup;
  public workshop: FormGroup;
  public selectedTopic: FormGroup;
  public timeline: FormGroup;
  public conditions: FormGroup;
  public phoneDetails: FormGroup;
  public paymentInfo: FormGroup;

  private workshopId: string;
  // Set our default values
  public localState = { value: '' };
  public countries: any[];
  public languagesArray: any[];
  public userId: string;
  public selectedValues: boolean[] = [false, false];
  public selectedOption = -1;

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
  public otpSent = false;

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

  public urlForVideo = [];
  public urlForImages = [];

  public datesEditable = false;
  public isPhoneVerified = false;
  public isSubmitted = false;

  // TypeScript public modifiers
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public config: AppConfig,
    public authenticationService: AuthenticationService,
    private languagePickerService: LanguagePickerService,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    public _collectionService: CollectionService,
    private mediaUploader: MediaUploaderService,
    private cookieUtilsService: CookieUtilsService,
    public requestHeaderService: RequestHeaderService,
    private dialog: MdDialog,
    private _leftSideBarService: LeftSidebarService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.workshopId = params['workshopId'];
      this.step = params['step'];
    });
    this.userId = cookieUtilsService.getValue('userId');
    this.options = requestHeaderService.getOptions();

  }

  public ngOnInit() {
    console.log('Inside oninit workshop');
    this.interest1 = new FormGroup({
      // interests: this._fb.array([])
    });

    this.newTopic = this._fb.group({
      topicName: ['', Validators.requiredTrue]
    });

    this.workshop = this._fb.group({
      // id: '',
      type: 'workshop',
      title: '',
      stage: '',
      language: this._fb.array([]),
      selectedLanguage: '',
      headline: '',
      description: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      difficultyLevel: '',
      prerequisites: '',
      maxSpots: '',
      videoUrls: [],
      imageUrls: [],
      totalHours: '',
      price: '',
      currency: '',
      cancellationPolicy: '',
      ageLimit: '',
      aboutHost: '', // [null,Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])],
      notes: '',
      // isApproved: '',
      approvedBy: '',
      // isCanceled: '',
      canceledBy: '',
      status: 'draft',
      // createdAt: '',
      // updatedAt: ''
    });

    this.timeline = this._fb.group({
      calendar: this._fb.group({
        startDate: null,
        endDate: null
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

    this.phoneDetails = this._fb.group({
      phoneNo: '',
      inputOTP: ''
    });

    this.paymentInfo = this._fb.group({

    });

    this.initializeFormFields();

    this.initializeWorkshop();

    this._CANVAS = <HTMLCanvasElement>document.querySelector('#video-canvas');
    this._VIDEO = document.querySelector('#main-video');
  }

  private extractDate(dateString: string) {
    return moment(dateString.split('T')[0]).toDate();
  }

  private extractTime(dateString: string) {
    const time = moment.utc(dateString).local().format('HH:mm:ss');
    return time;
  }

  private initializeTimeLine(res) {
    if (res.calendars[0].startDate) {
      const calendar = res.calendars[0];
      calendar['startDate'] = this.extractDate(calendar.startDate);
      calendar['endDate'] = this.extractDate(calendar.endDate);
      this._collectionService.sanitize(calendar);
      this.timeline.controls.calendar.patchValue(calendar);
      this.initializeContentForm(res);
    }
  }

  public initializeContentForm(res) {
    const contentGroup = <FormGroup>this.timeline.controls.contentGroup;
    const itenary = <FormArray>contentGroup.controls.itenary;
    const itenaries = this.getContents(res.contents);
    for (const key in itenaries) {
      if (itenaries.hasOwnProperty(key)) {
        const itr: FormGroup = this.InitItenary();
        console.log(itr);
        itr.controls.date.patchValue(moment(this.calculatedDate(this.timeline.value.calendar.startDate, key)).toDate());
        for (const contentObj of itenaries[key]) {
          const contentForm: FormGroup = this.InitContent();
          this.assignFormValues(contentForm, contentObj);
          const contents = <FormArray>itr.controls.contents;
          contents.push(contentForm);
        }
        itenary.push(itr);
      }
    }
    console.log(itenary);
  }

  /**
   * assignFormValues
   */
  public assignFormValues(form: FormGroup, value: any) {
    for (const key in value) {
      if (value.hasOwnProperty(key) && form.controls[key]) {
        if (form.controls[key] instanceof FormGroup) {
          this.assignFormValues(<FormGroup>form.controls[key], value[key]);
        } else {
          if (key === 'startTime' || key === 'endTime') {
            form.controls[key].patchValue(this.extractTime(value[key]));
          } else if (key === 'startDay' || key === 'endDay') {
            form.controls[key].patchValue(this.calculatedDate(this.timeline.value.calendar.startDate, value[key]));
          } else if (key === 'supplementUrls') {
            // form.controls[key] = value[key];
          } else {
            form.controls[key].patchValue(value[key]);
          }
        }
      } else {
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

  public getContents(contents) {
    const itenaries = {};
    for (const contentObj of contents) {
      contentObj.schedule = contentObj.schedules[0];
      delete contentObj.schedules;
      if (itenaries.hasOwnProperty(contentObj.schedule.startDay)) {
        itenaries[contentObj.schedule.startDay].push(contentObj);
      } else {
        itenaries[contentObj.schedule.startDay] = [contentObj];
        this.itenariesForMenu.push(contentObj.schedule.startDay);
      }
    }
    this.sidebarMenuItems[2]['submenu'] = [];
    let i = 1;
    this.itenariesForMenu.forEach(function (item) {
      const index = i;
      this.sidebarMenuItems[2]['submenu'].push({
        'title': 'Day ' + index,
        'step': 13 + '_' + index,
        'active': false,
        'visible': true
      });
      i++;
    }, this);
    return itenaries;
  }

  private initializeFormFields() {
    this.difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    this.cancellationPolicies = ['24 Hours', '3 Days', '1 Week'];

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

    if (this.interests.length === 0) {
      this.http.get(this.config.searchUrl + '/api/search/topics')
        .map((response: any) => {
          this.suggestedTopics = response.slice(0, 7);
        }).subscribe();
    } else {
      this.suggestedTopics = this.interests;
    }

    this.profileImagePending = true;
    this.workshopVideoPending = true;
    this.workshopImage1Pending = true;
  }

  private initializeWorkshop() {
    console.log('Inside init workshop');
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
          this.initializeTimeLine(res);

          if (res.status === 'active') {
            this.sidebarMenuItems[3].visible = false;
            this.sidebarMenuItems[4].visible = true;
            this.sidebarMenuItems[4].active = true;
            this.sidebarMenuItems[4].submenu[0].visible = true;
            this.sidebarMenuItems[4].submenu[1].visible = true;
          }

        },
        err => console.log('error'),
        () => console.log('Completed!'));

    } else {
      console.log('NO COLLECTION');
    }
  }

  public languageChange(event) {
    if (event) {
      this.selectedLanguages = event.value;
      this.workshop.controls.selectedLanguage.setValue(event.value);
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
      });
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
    // console.log(res);
    // Topics
    this.relTopics = _.uniqBy(res.topics, 'id');
    this.interests = this.relTopics;
    if (this.interests) {
      this.suggestedTopics = this.interests;
    }
    // Language
    if (res.language && res.language.length > 0) {
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

    // Seats
    this.workshop.controls.maxSpots.patchValue(res.maxSpots);

    // Photos and Videos
    if (res.videoUrls && res.videoUrls.length > 0) {
      this.workshop.controls['videoUrls'].patchValue(res.videoUrls);
      this.urlForVideo = res.videoUrls;
    }
    if (res.imageUrls && res.imageUrls.length > 0) {
      this.workshop.controls['imageUrls'].patchValue(res.imageUrls);
      this.urlForImages = res.imageUrls;
    }

    // Currency, Amount, Cancellation Policy
    this.workshop.controls.price.patchValue(res.price);
    this.workshop.controls.currency.patchValue(res.currency);
    this.workshop.controls.cancellationPolicy.setValue(res.cancellationPolicy);

    // Status
    this.workshop.controls.status.setValue(res.status);

    this.isPhoneVerified = res.owners[0].phoneVerified;

    this.isSubmitted = this.workshop.controls.status.value === 'submitted';

    this.phoneDetails.controls.phoneNo.patchValue(res.owners[0].phone);
    if (!this.timeline.controls.calendar.value.startDate || !this.timeline.controls.calendar.value.endDate) {
      this.makeDatesEditable();
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

  public addImageUrl(value: String) {
      console.log('Adding image url: ' + value);
      this.urlForImages.push(value);
      const control = <FormArray>this.workshop.controls['imageUrls'];
      this.workshopImage1Pending = false;
      control.patchValue(this.urlForImages);
  }

  public addVideoUrl(value: String) {
      console.log('Adding video url: ' + value);
      this.urlForVideo.push(value);
      const control = this.workshop.controls['videoUrls'];
      this.workshopVideoPending = false;
      control.patchValue(this.urlForVideo);
  }

  uploadVideo(event) {
    console.log('upload xhr is: ' + JSON.stringify(event.xhr.response));
    const xhrResp = JSON.parse(event.xhr.response);
    this.addVideoUrl(xhrResp.url);
  }

  uploadImages(event) {
    console.log('upload xhr is: ' + JSON.stringify(event.xhr.response));
    const xhrResp = JSON.parse(event.xhr.response);
    this.addImageUrl(xhrResp.url);
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
    if (this.workshop.controls.status.value === 'active') {
        let dialogRef: any;
        dialogRef = this.dialog.open(WorkshopCloneDialogComponent, {disableClose: true, hasBackdrop: true, width: '40%'});
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'accept') {
            this.executeSubmitWorkshop(data);
          }
          else if (result === 'reject') {
            this.router.navigate(['/console/teaching/workshops']);
          }
        });
    }
    else {
      this.executeSubmitWorkshop(data);
    }
  }

  private executeSubmitWorkshop(data) {
      const lang = <FormArray>this.workshop.controls.language;
      lang.removeAt(0);
      lang.push(this._fb.control(data.value.selectedLanguage));
      const body = data.value;
      delete body.selectedLanguage;

      this._collectionService.patchCollection(this.workshopId, body).map(
          (response) => {
              const result = response.json();
              this.sidebarMenuItems = this._leftSideBarService.updateSideMenu(result, this.sidebarMenuItems);
              this.step++;
              this.workshopStepUpdate();
              if (result.isNewInstance) {
                  this.router.navigate(['workshop', result.id, 'edit', this.step]);
                  this.workshop.controls.status.setValue(result.status);
              }
              else {
                  this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
              }
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
      this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body)
        .map((response) => {
          console.log(this.step);
          this.step++;
          console.log(this.step);
          this.workshopStepUpdate();
          this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
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
      topicArray = _.without(topicArray, topic.id);
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
      //             this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
      //   });
      // patchRequest.subscribe((res) => {
      //     this.step++;
      //     this.workshopStepUpdate();
      //             this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
      // })

      let observable: Rx.Observable<any>;
      observable = this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/topics/rel', body)
        .map(response => response).publishReplay().refCount();
      observable.subscribe((res) => {
        this.step++;
        this.workshopStepUpdate();
        this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
      });
    } else {
      this.step++;
      this.workshopStepUpdate();
      this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
    }
  }

  /**
   * goto(toggleStep)  */
  public goto(toggleStep) {
    this.step = toggleStep;
    this.router.navigate(['workshop', this.workshopId, 'edit', +toggleStep]);
  }


  submitForReview() {
    // Post Workshop for review
    this._collectionService.submitForReview(this.workshopId)
      .subscribe((res) => {
        this.workshop.controls.status.setValue('submitted');
        console.log('Workshop submitted for review');
        this.isSubmitted = true;
        let dialogRef: any;
        dialogRef = this.dialog.open(WorkshopSubmitDialogComponent, {disableClose: false, hasBackdrop: true, width: '40vw'});
        // call to get status of workshop
        if (this.workshop.controls.status.value === 'active') {
          this.sidebarMenuItems[3].visible = false;
          this.sidebarMenuItems[4].visible = true;
          this.sidebarMenuItems[4].active = true;
          this.sidebarMenuItems[4].submenu[0].visible = true;
          this.sidebarMenuItems[4].submenu[1].visible = true;
        }
      });

  }

  saveandexit() {

    if (this.step === 13) {
      const data = this.timeline;
      const body = data.value.calendar;
      if (body.startDate && body.endDate) {
        this.http.patch(this.config.apiUrl + '/api/collections/' + this.workshopId + '/calendar', body, this.options)
          .map((response) => {
            this.router.navigate(['console/teaching/workshops']);
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
          this.router.navigate(['console/teaching/workshops']);
        }).subscribe();
    }
  }

  exit() {
      this.router.navigate(['console/teaching/workshops']);
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
        console.log('CHanged');
        this.suggestedTopics = this.interests;
        modal.hide();
      })
      .subscribe();
  }


  uploadCanvasVideo(event) {
    // Validate whether MP4
    if (['video/'].indexOf(event.target.files[0].type) === -1) {
      alert('Error : Only Video allowed');
      return;
    }

    this._CTX = this._CANVAS.getContext('2d');
    // Hide upload button
    //  document.querySelector("#upload-button").style.display = 'none';

    // Object Url as the video source
    document.querySelector('#main-video source').setAttribute('src', URL.createObjectURL(event.target.files[0]));
    // Load the video and show it
    this._VIDEO.load();
    // this._VIDEO.style.display = 'inline';
    const self = this;

    // this._VIDEO.onloadedmetadata = function(e){
    this._VIDEO.addEventListener('loadedmetadata', function (e) {
      setTimeout(() => self.getMetadata(), 1000);
      // self._CTX = self._CANVAS.getContext("2d");
      // self._CANVAS.width = 150;//this.videoWidth;
      // self._CANVAS.height = 100;//this.videoHeight;
      // self._CTX.drawImage(this, 0, 0, self._CANVAS.width, self._CANVAS.height);
    }, false);
  }

  getMetadata() {
    console.log(new Date());
    this._CANVAS.width = 150; // this.videoWidth;
    this._CANVAS.height = 100; // this.videoHeight;
    this._CTX.drawImage(this._VIDEO, 0, 0, this._CANVAS.width, this._CANVAS.height);

  }

  uploadImage1(event) {
    if (event.target.files == null || event.target.files === undefined) {
      document.write('This Browser has no support for HTML5 FileReader yet!');
      return false;
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const imageType = /image.*/;

      if (!file.type.match(imageType)) {
        continue;

      }

      const reader = new FileReader();

      if (reader != null) {

        reader.onload = this.GetThumbnail;
        reader.readAsDataURL(file);
      }


    }
  }

  GetThumbnail(e) {
    const myCan = document.createElement('canvas');
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {

      myCan.id = 'myTempCanvas';
      const tsize = 100;
      myCan.width = Number(tsize);
      myCan.height = Number(tsize);
      if (myCan.getContext) {
        const cntxt = myCan.getContext('2d');
        cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
        const dataURL = myCan.toDataURL();


        if (dataURL != null && dataURL !== undefined) {
          const nImg = document.createElement('img');
          nImg.src = dataURL;
          document.getElementById('image-holder').appendChild(nImg);

        } else {
          alert('unable to get context');
        }

      }
    };

  }

  deleteFromContainer(fileUrl, fileType) {
    const fileurl = fileUrl;
    fileUrl = _.replace(fileUrl, 'download', 'files');
    this.http.delete(this.config.apiUrl + fileUrl)
      .map((response) => {
        console.log(response);
        if (fileType === 'video') {
          this.urlForVideo = _.remove(this.urlForVideo, function (n) {
              return n !== fileurl;
          });
          this.workshop.controls.videoUrls.patchValue(this.urlForVideo);
        } else if (fileType === 'image') {
          this.urlForImages = _.remove(this.urlForImages, function (n) {
            return n !== fileurl;
          });
          this.workshop.controls.imageUrls.patchValue(this.urlForImages);
        }
      }).subscribe();

  }

  deleteFromContainerArr(event, fileType) {
    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      const fileurl = file;
      file = _.replace(file, 'download', 'files');
      this.http.delete(this.config.apiUrl + file)
        .map((response) => {
          console.log(response);
          if (fileType === 'video') {
            this.urlForVideo = _.remove(this.urlForVideo, function (n) {
                return n !== fileurl;
            });
            this.workshop.controls.videoUrls.patchValue(this.urlForVideo);
          } else if (fileType === 'image') {
            this.urlForImages = _.remove(this.urlForImages, function (n) {
              return n !== fileurl;
            });
            this.workshop.controls.imageUrls.patchValue(this.urlForImages);
          }
        }).subscribe();

    }
  }

  toggleChoice(choice) {
    this.selectedOption = choice;
  }


  submitPhoneNo(element, text) {
    // Call the OTP service
    // Post Workshop for review

    element.textContent = text;
    this._collectionService.sendVerifySMS(this.phoneDetails.controls.phoneNo.value)
      .subscribe((res) => {
        this.otpSent = true;
        this.phoneDetails.controls.phoneNo.disable();
        element.textContent = 'OTP Sent';
      });
  }

  submitOTP() {
    this._collectionService.confirmSmsOTP(this.phoneDetails.controls.inputOTP.value)
      .subscribe((res) => {
        console.log('Token Verified');
      });
  }

  takeToPayment() {
    this.step++;
    this.router.navigate(['workshop', this.workshopId, 'edit', this.step]);
  }

    /**
     * Make the dates section of this page editable
     */
  makeDatesEditable() {
    this.datesEditable = true;
  }

  openWorkshop() {
    this.router.navigate(['/workshop', this.workshopId]);
  }

}

