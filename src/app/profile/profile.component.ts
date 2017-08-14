import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ProfileService } from '../_services/profile/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileId: string;
  public userType = 'learner';
  public userId: string;
  public peer: any = {};
  public reviews: any = [];
  public joinedCollectionReviews: any = [];
  public collectionCalendarSchedules: any = [];
  public max = 5;
  public rate = 0;
  public isReadonly = true;
  public sessions: any = [];
  public experiences: any = [];
  public workshops: any = [];
  public defaultProfileUrl = '/assets/images/default-user.jpg';
  public defaultImageUrl = 'http://lorempixel.com/350/250/city/9';
  public calendars: any = [];
  public showHideSession = false;
  public profile: any;

  constructor(private config: AppConfig,
    public profileService: ProfileService,
    private cookieUtilsService: CookieUtilsService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.profileId = params['profileId'];
    });
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.getUserType(this.setUserData.bind(this));
  }

  setUserData() {
    this.getPeer();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile[0];
    });
  }

  getPeer() {
    // console.log('in get peer');
    this.profileService.getPeer(this.profileId).subscribe((peer) => {
      console.log('peer' + JSON.stringify(peer));
      this.peer = peer;
      this.peer.identities.forEach(identity => {
        identity.profile = JSON.parse(identity.profile);
      });
      this.getCollectionReview();
    });
  }

  getCollectionReview() {

    // expert owned collection - he/she is teaching
    if (this.peer.ownedCollections && this.peer.ownedCollections.length) {

      this.peer.ownedCollections.forEach(collection => {
        if (collection.reviews && collection.reviews.length) {
          collection.reviews.forEach((review) => {
            review.collection = {
              'type': collection.type,
              'title': collection.title,
              'headline': collection.headline,
              'createdAt': collection.createdAt
            };
            review.reviewer = review.peer[0].profiles[0];
            this.reviews.push(review);
            this.rate += review.score;
          });
        }

        if (collection.calendars && collection.calendars.length) {
          collection.calendars.forEach(calendar => {
            if (collection.contents && collection.contents.length) {
              calendar.contents = this.cloneObject(collection.contents);
              calendar.contents.forEach(content => {
                const startDate = moment(calendar.startDate).add(content.schedules[0].startDay, 'days');
                const endDate = moment(startDate).add(content.schedules[0].endDay, 'days');
                content.schedules[0].startDate = startDate;
                content.schedules[0].endDate = endDate;
              });
            }
          });
        }

        // store owned collection into separate array
        if (collection.type === 'session') {
          this.sessions.push(collection);
        }
        if (collection.type === 'experience') {
          this.experiences.push(collection);
        }
        if (collection.type === 'workshop') {
          this.workshops.push(collection);
        }
      });
      if (this.reviews && this.reviews.length) {
        this.rate = this.rate / this.reviews.length;
      }
    }

    // learning collection - he/she is learning
    if (this.peer.collections && this.peer.collections.length) {

      this.peer.collections.forEach(joinedCollection => {

        // for learning journey section
        let joinedCollectionRating = 0.0;

        // for teacher review section
        if (joinedCollection.reviews && joinedCollection.reviews.length) {

          joinedCollection.reviews.forEach((joinedCollectionReview) => {

            joinedCollectionReview.collection = {
              'type': joinedCollection.type,
              'title': joinedCollection.title,
              'headline': joinedCollection.headline,
              'createdAt': joinedCollection.createdAt
            };

            joinedCollectionReview.reviewer = joinedCollectionReview.peer[0].profiles[0];
            this.joinedCollectionReviews.push(joinedCollectionReview);

            joinedCollectionRating += joinedCollectionReview.score;

          });

          joinedCollectionRating = joinedCollectionRating / joinedCollection.reviews.length;
          joinedCollection.rate = joinedCollectionRating;
          if (joinedCollection.description > 127) {
            joinedCollection.description = (joinedCollection.description).substr(0, 127);
          }
        }
      });
    }

    // console.log('peer' + JSON.stringify(this.peer));
  }

  // recursive function to clone an object. If a non object parameter
  // is passed in, that parameter is returned and no recursion occurs.

  cloneObject(obj) {
    try {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      const temp = obj.constructor(); // give temp the original obj's
      // constructor

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = this.cloneObject(obj[key]);
        }
      }

      return temp;
    } catch (e) {
      console.log('In cloneObject catch ' + e);
    }
  }
  getUserType(setUserData) {
    this.profileService.getOwnedCollectionCount(this.profileId).subscribe(collection_count => {
      if (collection_count.count > 0) {
        this.userType = 'teacher';
      }
      setUserData();
    });
        console.log(this.userType);
  }
}
