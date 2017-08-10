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
// import { Response } from '@angular/http';

@Injectable()
export class ProfileService {
  public key = 'userId';
  private userId;

  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router) {
    this.userId = this.getCookieValue(this.key);
  }

  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  public getProfile() {
    const profile = {};
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/profile')
        .map((response: Response) => response.json()
        );
    }
  }

  public socialProfiles() {
    const socialProfile = [];
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/identities')
        .map((response: Response) => response.json()
        );
    }
  }

  public interestTopics(topicsFor) {
    const interestTopics = [];
    if (this.userId) {

      const topicsUrl = topicsFor === 'teacher' ? '/topicsTeaching' : '/topicsLearning' ;

      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + topicsUrl)
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

  public sendVerifyEmail() {
    return this.http
      .get(this.config.apiUrl + '/api/peers/sendVerifyEmail?uid=' + this.userId)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public confirmEmail(inputToken: string, redirect: string) {
    return this.http
      .get(this.config.apiUrl + '/api/peers/confirmEmail?uid=' + this.userId + '&token=' + inputToken + '&redirect=' + redirect)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }
  /* Signup Verification Methods Ends*/

  public getSocialIdentities() {
    return this.http
      .get(this.config.apiUrl + '/api/peers/' + this.userId)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  /* get collections */
  public getCollections() {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/ownedCollections')
        .map((response: Response) => response.json(), (err) => {
          console.log('Error: ' + err);
        });
    }
  }

  /* get reviews */
  // public getReviews(res: Response) {
  //   // if (this.userId) {
  //     console.log(this.userId);
  //     const collections = res.json();
  //     const reviews: any = [];
  //     console.log(collections);
  //     collections.forEach(collection => {
  //       this.http.get(this.config.apiUrl + '/api/collections/' + collection.id + '/reviews')
  //         .map((revResponse) => {
  //           console.log(revResponse);
  //           reviews.push(revResponse.json());
  //         });
  //     });
  //     console.log(reviews);
  //     return reviews;
  //   }
  // // }
  public getReviews(collectionId) {
    if (this.userId) {
      // console.log(collections);
      // const reviews: any = [];
      //  collections.forEach(collection => {
      return this.http.get(this.config.apiUrl + '/api/collections/' + collectionId + '/reviews')
        .map((response: Response) => response.json());
    }
  }
  public getOwnedCollectionCount() {
     if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/peers/' + this.userId + '/ownedCollections/count')
      .map((response: Response) => response.json());
    }
  }
   public getReviewer(reviewId) {
     if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/reviews/' + reviewId + '/peer')
      .map((response: Response) => response.json());
    }
  }
}