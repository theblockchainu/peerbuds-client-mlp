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
import { RequestHeaderService } from '../requestHeader/request-header.service';
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
      "include": [{"profiles":["work","education"]}, "topicsLearning","topicsTeaching",
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

  public getProfileData(filter: any) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/profiles?filter=' + JSON.stringify(filter), this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  public getExternalProfileData(id: string, filter: any) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '/profiles?filter=' + JSON.stringify(filter), this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  /**
   * getPeerData
   */
  public getPeerData(filter?: any): Observable<any> {
    if (filter) {
      if (this.userId) {
        return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '?filter=' + JSON.stringify(filter), this.options)
          .map(
          (response: Response) => response.json()
          );
      }
    } else {
      if (this.userId) {
        return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId, this.options)
          .map(
          (response: Response) => response.json()
          );
      }
    }
  }
  public getCompactProfile(userId) {
    const profile = {};
    if (this.userId) {
      const filter = '{"include": {"peer": "ownedCollections"}}';
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/profiles?filter=' + filter, this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  public getPeerProfile() {
    return this.userId;
  }

  public updatePeer(body: any) {
    if (this.userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId, body, this.options).map(
        response => response.json()
      );
    }
  }
  public updateProfile(body: any) {
    if (this.userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId + '/profile', body, this.options)
        .map((response: Response) => response.json());
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
  public sendVerifySms(phonenumber) {
    const body = {
    };
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifySms/' + '&phone=' + phonenumber, body, this.options)
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

  public confirmSmsOTP(inputToken: string) {
    const body = {};
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmSmsOTP/' + '&token=' + inputToken, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  /* Signup Verification Methods Ends*/

  public getSocialIdentities(query: any, peerId?: string) {
    let userId;
    let url;
    if (peerId) {
      userId = peerId;
    }
    else {
      userId = this.userId;
    }
    if(query) {
      const filter = JSON.stringify(query);
      url = this.config.apiUrl + '/api/peers/' + userId + '?filter=' + filter;
    }
    else {
      url = this.config.apiUrl + '/api/peers/' + userId;
    }

    return this.http
      .get(url, this.options)
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

  // public updateProfile(profile: any, cb: any) {
  //   const sanitizedProfile = profile;
  //   if (!(profile !== undefined && this.userId)) {
  //     console.log('User not logged in');
  //   } else {
  //     this.http
  //       .patch(this.config.apiUrl + '/api/peers/' + this.userId + '/profile', this.sanitize(sanitizedProfile), this.options)
  //       .map((response) => {
  //         cb(null, response.json());
  //       }, (err) => {
  //         cb(err);
  //       }).subscribe();
  //   }
  // }

  /**
   * Delete all work nodes of a profile
   * @param profileId
   * @param cb
   */
  public deleteProfileWorks(profileId, cb) {
    this.http
      .delete(this.config.apiUrl + '/api/profiles/' + profileId + '/work', this.options)
      .map((response) => {
        cb(null, response);
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  public updateWork(profileId, work: any) {
    if (!(work.length > 0 && this.userId)) {
      console.log('User not logged in');
    } else {
      return this.http.delete(this.config.apiUrl + '/api/profiles/' + profileId + '/work', this.options)
        .flatMap(
        (response) => {
          return this.http
            .post(this.config.apiUrl + '/api/profiles/' + profileId + '/work', this.sanitize(work), this.options);
        }
        ).map((response) => response.json());
    }
  }

  public updateProfileWorks(profileId, work: any, cb: any) {
    if (!(work.length > 0 && this.userId)) {
      console.log('User not logged in');
      cb(new Error('User not logged in or work body blank'));
    } else {
      this.http
        .post(this.config.apiUrl + '/api/profiles/' + profileId + '/work', this.sanitize(work), this.options)
        .map((response1) => {
          cb(null, response1.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  /**
   * Delete all education nodes of a profile
   * @param profileId
   * @param cb
   */
  public deleteProfileEducations(profileId, cb) {
    this.http
      .delete(this.config.apiUrl + '/api/profiles/' + profileId + '/education', this.options)
      .map((response) => {
        cb(null, response);
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  public updateProfileEducations(profileId, education: any, cb: any) {
    if (!(education.length > 0 && this.userId)) {
      console.log('User not logged in');
      cb(new Error('User not logged in or education body blank'));
    } else {
      this.http
        .post(this.config.apiUrl + '/api/profiles/' + profileId + '/education', this.sanitize(education), this.options)
        .map((response1) => {
          cb(null, response1.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public updateEducation(profileId, education: any) {
    if (!this.userId) {
      console.log('User not logged in');
    } else {
      return this.http.delete(this.config.apiUrl + '/api/profiles/' + profileId + '/education', this.options)
        .flatMap((response) => {
          return this.http
            .post(this.config.apiUrl + '/api/profiles/' + profileId + '/education', this.sanitize(education), this.options);
        })
        .map((result2) => result2.json()
        );
    }
  }
  /**
   * sanitize
   */
  public sanitize(object: any) {
    delete object.id;
    delete object.peer;
    delete object.work;
    delete object.education;
    return object;
  }

  getUserId() {
    return this.getCookieValue(this.key);
  }

  /**
   * getAllPeers
   */
  public getAllPeers(query: any) {
    return this.http.get(this.config.apiUrl + '/api/peers?filter=' + JSON.stringify(query));
  }

  /**
   * getTopics
   */
  public getLearningTopics(query?: any) {
    if (query) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning?filter=' + JSON.stringify(query))
        .map(response => response.json());
    } else {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning')
        .map(response => response.json());
    }

  }

  public getTeachingTopics(query: any) {
    return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching?filter=' + JSON.stringify(query))
      .map(response => response.json());
  }

  public getTeachingExternalTopics(userId: string, query: any) {
    return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching?filter=' + JSON.stringify(query))
      .map(response => response.json());
  }
  /**
   * unfollowTopic
   */
  public unfollowTopic(topicId: string) {
    return this.http.delete(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning/rel/' + topicId);
  }

  public stopTeachingTopic(topicId: string) {
    return this.http.delete(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching/rel/' + topicId);
  }
  /**
   * followTopic
   */
  public followTopic(topicId: string, body?: any) {
    if (body) {
      return this.http.put(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning/rel/' + topicId, body, this.options)
        .map(response => response.json());
    } else {
      return this.http.put(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning/rel/' + topicId, {}, this.options)
        .map(response => response.json());
    }
  }

  public updateTeachingTopic(topicId: string, body?: any) {
    if (body) {
      console.log(topicId + ' ' + body.experience);
      return this.http.delete(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching/rel/' + topicId, this.options)
        .flatMap((response) => {
          return this.http.put(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching/rel/' + topicId, body, this.options);
        }).map(response => response.json());
    } else {
      return this.http.put(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching/rel/' + topicId, {}, this.options)
        .map(response => response.json());
    }
  }


  public followMultipleTopicsLearning(body: any) {
    return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsLearning/rel', body, this.options)
      .map(response => response.json());
  }

  public followMultipleTopicsTeaching(body: any) {
    return this.http.patch(this.config.apiUrl + '/api/peers/' + this.userId + '/topicsTeaching/rel', body, this.options)
      .map(response => response.json());
  }

  /**
   * reportProfile
   */
  public reportProfile(userId: string, body: any) {
    return this.http.post(this.config.apiUrl + '/api/peers/' + userId + '/flags', body)
      .map(response => response.json());
  }

}
