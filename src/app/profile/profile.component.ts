import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ProfileService } from '../_services/profile/profile.service';
import { CollectionService } from '../_services/collection/collection.service';
import { TopicService } from '../_services/topic/topic.service';
import { ReportProfileComponent } from './report-profile/report-profile.component';
import { MdDialog, MdSnackBar } from '@angular/material';

import * as moment from 'moment';
import _ from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public cookieUserId: string;
  public loading: boolean;
  public urluserId: string;
  public profileObj: any;
  public interestsArray: Array<string>;
  public userRating: number;
  public collectionTypes = ['workshops'];
  public participatingWorkshops: Array<any>;
  public recommendedpeers: Array<any>;
  public socialIdentities: Array<any>;
  public maxVisibleInterest = 3;
  public topicsTeaching: Array<any>;
  public isTeacher: boolean;
  public offsetString = 'col-md-offset-1';

  constructor(
    public config: AppConfig,
    public _profileService: ProfileService,
    private cookieUtilsService: CookieUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public _collectionService: CollectionService,
    private _topicService: TopicService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar
  ) {
    this.activatedRoute.params.subscribe((param) => {
      const calledUserId = param['profileId'];
      if (this.urluserId !== calledUserId) {
        this.urluserId = calledUserId;
        this.fetchData();
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
  }

  private fetchData() {
    this.cookieUserId = this.cookieUtilsService.getValue('userId');
    this.loading = true;
    this.isTeacher = false;
    this.getProfileData();
    this.getRecommendedPeers();
    this.getIdentities();
    this.getTeachingTopics();
  }
  private getIdentities() {
    this._profileService.getSocialIdentities(this.urluserId).subscribe(
      (result) => {
        this.socialIdentities = result;
      }
    );
  }

  private getRecommendedPeers() {
    const query = {
      'include': [
        'reviewsAboutYou',
        'profiles'
      ],
      'limit': 4
    };
    this._profileService.getAllPeers(query).subscribe((result) => {
      this.recommendedpeers = [];
      for (const responseObj of result.json()) {
        responseObj.rating = this._collectionService.calculateRating(responseObj.reviewsAboutYou);
        this.recommendedpeers.push(responseObj);
      }
    }, (err) => {
      console.log(err);
    });
  }

  private getTeachingTopics() {
    const queryTeaching = {
      'relInclude': 'experience'
    };
    this._profileService.getTeachingExternalTopics(this.urluserId, queryTeaching).subscribe((response) => {
      console.log(response);
      this.topicsTeaching = response;
    });
  }

  private getRecommendedWorkshops(response: Array<any>) {
    this.participatingWorkshops = [];
    console.log(response);
    response.forEach(collection => {
      if (collection.reviews) {
        collection.rating = this._collectionService.calculateRating(collection.reviews);
      }
      this.participatingWorkshops.push(collection);
    });
    this.participatingWorkshops = _.uniqBy(this.participatingWorkshops, 'id');
  }

  private getProfileData() {
    const query = {
      'include': [
        'education',
        'work',
        {
          'peer': ['topicsLearning', 'topicsTeaching',
            {
              'ownedCollections': [
                { 'contents': ['schedules'] }
                , 'calendars']
            },
            {
              'collections': ['reviews']
            }
          ]
        }
      ]
    };
    this._profileService.getExternalProfileData(this.urluserId, query).subscribe((response) => {
      this.profileObj = response[0];
      console.log(this.profileObj);
      this.setInterests();
      if (this.profileObj.peer['0'].ownedCollections && this.profileObj.peer['0'].ownedCollections.length > 0) {
        this.calculateCollectionDurations();
        this.isTeacher = true;
        this.offsetString = '';
      }
      if (this.profileObj.peer[0].collections) {
        this.getRecommendedWorkshops(this.profileObj.peer[0].collections);
      }
    });
  }

  private setInterests() {
    this.interestsArray = [];
    if (this.profileObj.peer[0].topicsTeaching && this.profileObj.peer[0].topicsTeaching.length > 0) {
      this.profileObj.peer[0].topicsTeaching.forEach(topic => {
        this.interestsArray.push(topic.name);
      });
    }
    if (this.profileObj.peer[0].topicsLearning && this.profileObj.peer[0].topicsLearning.length > 0) {
      this.profileObj.peer[0].topicsLearning.forEach(topic => {
        if (!this.interestsArray.includes(topic.name)) {
          this.interestsArray.push(topic.name);
        }
      });
    }
  }

  private calculateCollectionDurations() {
    this.profileObj.peer['0'].ownedCollections.forEach(collection => {
      collection.totalDuration = this.calculateTotalHours(collection);
      collection.itenaryArray = this.calculateItenaries(collection);
    });
  }

  private calculateItenaries(workshop) {
    const itenariesObj = {};
    const itenaryArray = [];
    if (workshop.contents) {
      workshop.contents.forEach(contentObj => {
        if (itenariesObj.hasOwnProperty(contentObj.schedules[0].startDay)) {
          itenariesObj[contentObj.schedules[0].startDay].push(contentObj);
        } else {
          itenariesObj[contentObj.schedules[0].startDay] = [contentObj];
        }
      });

      for (const key in itenariesObj) {
        if (itenariesObj.hasOwnProperty(key)) {
          itenariesObj[key].sort(function (a, b) {
            return parseFloat(a.schedules[0].startTime) - parseFloat(b.schedules[0].startTime);
          });
          const itenary = {
            startDay: key,
            contents: itenariesObj[key]
          };
          itenaryArray.push(itenary);
        }
      }
      itenaryArray.sort(function (a, b) {
        return parseFloat(a.startDay) - parseFloat(b.startDay);
      });
    }
    return itenaryArray;
  }

  /**
   * calculateTotalHours
   */
  public calculateTotalHours(workshop) {
    let totalLength = 0;
    if (workshop.contents) {
      workshop.contents.forEach(content => {
        if (content.type === 'online') {
          const startMoment = moment(content.schedules[0].startTime);
          const endMoment = moment(content.schedules[0].endTime);
          const contentLength = moment.utc(endMoment.diff(startMoment)).format('HH');
          totalLength += parseInt(contentLength, 10);
        } else if (content.type === 'video') {

        }
      });
    }
    return totalLength.toString();
  }

  public toggleMaxInterest() {
    if (this.maxVisibleInterest === 3) {
      this.maxVisibleInterest = 999;
    } else {
      this.maxVisibleInterest = 3;
    }
  }

  public reportProfile() {
    const dialogRef = this.dialog.open(ReportProfileComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('report' + result);
        this._profileService.reportProfile(this.urluserId, {
          'description': result,
          'is_active': true
        }).subscribe((respone) => {
          console.log(respone);
          this.snackBar.open('Profile Reported', 'Close');
        }, (err) => {
          this.snackBar.open('Profile Reported Failed', 'Retry').onAction().subscribe(() => {
            this.reportProfile();
          });
        });
      }
    });
  }

  public navigateTo(id: string) {
    this.router.navigate(['profile', id]);
  }

}
