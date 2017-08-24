import { Injectable } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'ngx-cookie-service';

import { AppConfig } from '../../app.config';
import {RequestHeaderService} from '../requestHeader/request-header.service';
// import { Response } from '@angular/http';

@Injectable()
export class ProfileService {
  public key = 'userId';
  private userId;
  private options;

  constructor(private http: Http,
              private config: AppConfig,
              private _cookieService: CookieService,
              private route: ActivatedRoute,
              public router: Router,
              public _requestHeaderService: RequestHeaderService
  ) {
    this.userId = this.getCookieValue(this.key);
    this.options = this._requestHeaderService.getOptions();
  }

  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  public getPeer(id) {
    const peer = {};
    if (this.userId) {
      const options = `{"where": "","order": "","limit": "",
      "include": ["profiles", "topicsLearning","topicsTeaching",
      {"collections":{"reviews": {"peer": "profiles"}}},
      {"ownedCollections":[{"reviews":{"peer":"profiles"}},
      "calendars",{"contents":"schedules"}]},"communities","identities"]}`;
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '?filter=' + options, this.options)
        .map((response: Response) => response.json());
    }
  }

  public getProfile() {
    const profile = {};
    if (this.userId) {
      const filter = '{"include": [ {"peer":[{"reviewsByYou":{"reviewedPeer":"profiles"}},{"reviewsAboutYou":{"peer":"profiles"}},{"collections":["calendars",{"participants":"profiles"},"contents","topics"]},{"ownedCollections":["calendars",{"participants":"profiles"},"contents","topics"]}, "topicsLearning", "topicsTeaching"]}, "work", "education"]}';
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/profiles?filter=' + filter, this.options)
        .map(
          (response: Response) => response.json()
        );
    }
  }

  public getPeerProfile() {
    return this.userId;
    // if (this.userId) {
    //   const options = '{"include": "profiles"}';
    //   return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '?filter=' + options)
    //     .map((response: Response) => response.json()
    //     );
    // }
  }

  public updatePeer(id: any, body: any) {
    if (this.userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId, body, this.options);
    }
  }
  public updatePeerProfile(id, body: any) {
    if (this.userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId + '/profile', body, this.options);
      // patch first_name, last_name, dob, promoOptIn into peers/id/profiles
    }
  }

  public socialProfiles() {
    const socialProfile = [];
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/identities', this.options)
        .map((response: Response) => response.json()
        );
    }
  }

  public interestTopics(topicsFor) {
    const interestTopics = [];
    if (this.userId) {

      const topicsUrl = topicsFor === 'teacher' ? '/topicsTeaching' : '/topicsLearning';

      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + topicsUrl, this.options)
        .map((response: Response) => response.json()
        );
    }
  }
  /* Signup Verification Methods Starts*/
  public getPeerNode() {
    return this.http
      .get(this.config.apiUrl + '/api/peers/' + this.userId)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  public sendVerifyEmail(emailAddress) {
    const body = {
    };
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifyEmail?uid=' + this.userId + '&email=' + emailAddress, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public confirmEmail(inputToken: string) {
    const body = {};
    const redirect = 'onboarding';
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmEmail?uid=' + this.userId + '&token=' + inputToken + '&redirect=' + redirect, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  /* Signup Verification Methods Ends*/

  public getSocialIdentities() {
    return this.http
      .get(this.config.apiUrl + '/api/peers/' + this.userId + '/identities', this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  /* get collections */
  public getCollections() {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/ownedCollections', this.options)
        .map((response: Response) => response.json(), (err) => {
          console.log('Error: ' + err);
        });
    }
  }

  public getReviews(collectionId) {
    if (this.userId) {
      // console.log(collections);
      // const reviews: any = [];
      //  collections.forEach(collection => {
      return this.http.get(this.config.apiUrl + '/api/collections/' + collectionId + '/reviews', this.options)
        .map((response: Response) => response.json());
    }
  }
  public getOwnedCollectionCount(id) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '/ownedCollections/count', this.options)
        .map((response: Response) => response.json());
    }
  }
  public getReviewer(reviewId) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/reviews/' + reviewId + '/peer', this.options)
        .map((response: Response) => response.json());
    }
  }

  public updateProfile(profile: any, cb: any) {
    const sanitizedProfile = profile;
    if (!(profile !== undefined && this.userId)) {
      console.log('User not logged in');
    } else {
      this.http
        .patch(this.config.apiUrl + '/api/peers/' + this.userId + '/profile', this.sanitize(sanitizedProfile), this.options)
        .map((response) => {
          cb(null, response.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  /**
   * sanitize
   */
  private sanitize(newprofile: any) {
    delete newprofile.id;
    delete newprofile.peer;
    delete newprofile.work;
    delete newprofile.education;
    return newprofile;
  }

  getUserId() {
    return this.getCookieValue(this.key);
  }
}
