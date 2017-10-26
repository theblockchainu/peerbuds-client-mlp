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

@Injectable()
export class ProfileService {
  public key = 'userId';
  private options;

  constructor(private http: Http,
    private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router,
    public _requestHeaderService: RequestHeaderService
  ) {
    this.options = this._requestHeaderService.getOptions();
  }

  public getPeer(id) {
    debugger;
    const peer = {};
    if (id) {
      const options = `{"where": "","order": "","limit": "",
      "include": [{"profiles":["work","education"]}, "topicsLearning","topicsTeaching",
      {"collections":{"reviews": {"peer": "profiles"}}},
      {"ownedCollections":[{"reviews":{"peer":"profiles"}},
      "calendars",{"contents":"schedules"}]},"communities","identities"]}`;
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '?filter=' + options, this.options)
        .map((response: Response) => response.json());
    }
  }

  public getProfile(userId) {
    const profile = {};
    if (userId) {
      const filter = '{"include": [ {"peer":[{"reviewsByYou":{"reviewedPeer":"profiles"}},{"reviewsAboutYou":{"peer":"profiles"}},{"collections":["calendars",{"participants":"profiles"},"contents","topics"]},{"ownedCollections":["calendars",{"participants":"profiles"},"contents","topics"]}, "topicsLearning", "topicsTeaching"]}, "work", "education"]}';
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/profiles?filter=' + filter, this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  public getProfileData(userId, filter: any) {
    if (userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/profiles?filter=' + JSON.stringify(filter), this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  public getExternalProfileData(id: string, filter: any) {
    if (id) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '/profiles?filter=' + JSON.stringify(filter), this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  /**
   * getPeerData
   */
  public getPeerData(userId, filter?: any): Observable<any> {
    if (filter) {
      if (userId) {
        return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '?filter=' + JSON.stringify(filter), this.options)
          .map(
          (response: Response) => response.json()
          );
      }
    } else {
      if (userId) {
        return this.http.get(this.config.apiUrl + '/api/peers/' + userId, this.options)
          .map(
          (response: Response) => response.json()
          );
      }
    }
  }
  public getCompactProfile(userId) {
    debugger;
    const profile = {};
    if (userId) {
      const filter = '{"include": {"peer": "ownedCollections"}}';
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/profiles?filter=' + filter, this.options)
        .map(
        (response: Response) => response.json()
        );
    }
  }

  public updatePeer(userId, body: any) {
    if (userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + userId, body, this.options).map(
        response => response.json()
      );
    }
  }
  public updateProfile(userId, body: any) {
    if (userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + userId + '/profile', body, this.options)
        .map((response: Response) => response.json());
    }
  }

  public updatePeerProfile(userId, body: any) {
    if (userId) {
      return this.http.patch(this.config.apiUrl + '/api/peers/' + userId + '/profile', body, this.options);
      // patch first_name, last_name, dob, promoOptIn into peers/id/profiles
    }
  }

  public socialProfiles(userId) {
    const socialProfile = [];
    if (userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/identities', this.options)
        .map((response: Response) => response.json()
        );
    }
  }

  public interestTopics(userId, topicsFor) {
    const interestTopics = [];
    if (userId) {

      const topicsUrl = topicsFor === 'teacher' ? '/topicsTeaching' : '/topicsLearning';

      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + topicsUrl, this.options)
        .map((response: Response) => response.json()
        );
    }
  }
  /* Signup Verification Methods Starts*/
  public getPeerNode(userId) {
    return this.http
      .get(this.config.apiUrl + '/api/peers/' + userId)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  public sendVerifyEmail(userId, emailAddress) {
    const body = {
    };
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifyEmail?uid=' + userId + '&email=' + emailAddress, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  public sendVerifySms(phonenumber) {
    const body = {
    };
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifySms?phone=' + phonenumber, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  public sendVerifySms(phonenumber) {
    const body = {
    };
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifySms?phone=' + phonenumber, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public confirmEmail(userId, inputToken: string) {
    const body = {};
    const redirect = 'onboarding';
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmEmail?uid=' + userId + '&token=' + inputToken + '&redirect=' + redirect, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public confirmSmsOTP(inputToken: string) {
    const body = {};
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmSmsOTP?token=' + inputToken, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public confirmSmsOTP(inputToken: string) {
    const body = {};
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmSmsOTP?token=' + inputToken, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  /* Signup Verification Methods Ends*/

  public getSocialIdentities(query: any, peerId) {
    let url;
    if (query) {
      const filter = JSON.stringify(query);
      url = this.config.apiUrl + '/api/peers/' + peerId + '?filter=' + filter;
    }
    else {
      url = this.config.apiUrl + '/api/peers/' + peerId;
    }

    return this.http
      .get(url, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  /* get collections */
  public getCollections(userId) {
    if (userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/ownedCollections', this.options)
        .map((response: Response) => response.json(), (err) => {
          console.log('Error: ' + err);
        });
    }
  }

  public getReviews(userId, collectionId) {
    if (userId) {
      // console.log(collections);
      // const reviews: any = [];
      //  collections.forEach(collection => {
      return this.http.get(this.config.apiUrl + '/api/collections/' + collectionId + '/reviews', this.options)
        .map((response: Response) => response.json());
    }
  }
  public getOwnedCollectionCount(id) {
    if (id) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + id + '/ownedCollections/count', this.options)
        .map((response: Response) => response.json());
    }
  }
  public getReviewer(reviewId) {
    if (reviewId) {
      return this.http.get(this.config.apiUrl + '/api/reviews/' + reviewId + '/peer', this.options)
        .map((response: Response) => response.json());
    }
  }

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

  public updateWork(userId, profileId, work: any) {
    if (!(work.length > 0 && userId)) {
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

  public updateEmergencyContact(userId, profileId, emergency_contact) {
    if (!(emergency_contact.length > 0 && userId)) {
      console.log('User not logged in');
    } else {
      return this.http.delete(this.config.apiUrl + '/api/profiles/' + profileId + '/emergency_contacts', this.options)
        .flatMap(
        (response) => {
          return this.http
            .post(this.config.apiUrl + '/api/profiles/' + profileId + '/emergency_contacts', this.sanitize(emergency_contact), this.options);
        }
        ).map((response) => response.json());
    }
  }

  public updatePhoneNumbers(userId, profileId, phone_numbers) {
    if (!(phone_numbers.length > 0 && userId)) {
      console.log('User not logged in');
    } else {
      return this.http.delete(this.config.apiUrl + '/api/profiles/' + profileId + '/phone_numbers', this.options)
        .flatMap(
        (response) => {
          return this.http
            .post(this.config.apiUrl + '/api/profiles/' + profileId + '/phone_numbers', this.sanitize(phone_numbers), this.options);
        }
        ).map((response) => response.json());
    }
  }

  public updateProfileWorks(userId, profileId, work: any, cb: any) {
    if (!(work.length > 0 && userId)) {
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

  public updateProfileEducations(userId, profileId, education: any, cb: any) {
    if (!(education.length > 0 && userId)) {
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

  public updateEducation(userId, profileId, education: any) {
    if (!userId) {
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

  /**
   * getAllPeers
   */
  public getAllPeers(query: any) {
    debugger;
    return this.http.get(this.config.apiUrl + '/api/peers?filter=' + JSON.stringify(query));
  }

  /**
   * getTopics
   */
  public getLearningTopics(userId, query?: any) {
    if (query) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning?filter=' + JSON.stringify(query))
        .map(response => response.json());
    } else {
      return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning')
        .map(response => response.json());
    }

  }

  public getTeachingTopics(userId, query: any) {
    return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching?filter=' + JSON.stringify(query))
      .map(response => response.json());
  }

  public getTeachingExternalTopics(userId: string, query: any) {
    return this.http.get(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching?filter=' + JSON.stringify(query))
      .map(response => response.json());
  }
  /**
   * unfollowTopic
   */
  public unfollowTopic(userId, type, topicId: string) {
    if (type === 'learning') {
      return this.http.delete(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning/rel/' + topicId);
    }
    else {
      return this.http.delete(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId);
    }
  }

  public stopTeachingTopic(userId, topicId: string) {
    return this.http.delete(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId);
  }
  /**
   * followTopic
   */
  public followTopic(userId, type, topicId: string, body?: any) {
    if (type === 'learning') {
      if (body) {
        return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning/rel/' + topicId, body, this.options)
          .map(response => response.json());
      } else {
        return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning/rel/' + topicId, {}, this.options)
          .map(response => response.json());
      }
    }
    else {
      if (body) {
        return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId, body, this.options)
          .map(response => response.json());
      } else {
        return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId, {}, this.options)
          .map(response => response.json());
      }
    }
  }

  public updateTeachingTopic(userId, topicId: string, body?: any) {
    if (body) {
      console.log(topicId + ' ' + body.experience);
      return this.http.delete(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId, this.options)
        .flatMap((response) => {
          return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId, body, this.options);
        }).map(response => response.json());
    } else {
      return this.http.put(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel/' + topicId, {}, this.options)
        .map(response => response.json());
    }
  }


  public followMultipleTopicsLearning(userId, body: any) {
    return this.http.patch(this.config.apiUrl + '/api/peers/' + userId + '/topicsLearning/rel', body, this.options)
      .map(response => response.json());
  }

  public followMultipleTopicsTeaching(userId, body: any) {
    return this.http.patch(this.config.apiUrl + '/api/peers/' + userId + '/topicsTeaching/rel', body, this.options)
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
