import { Injectable } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../app.config';
import { RequestHeaderService } from '../requestHeader/request-header.service';
@Injectable()
export class CollectionService {
  public key = 'userId';
  private userId;
  public options;
  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router,
    private requestHeaderService: RequestHeaderService) {
    this.userId = this.getCookieValue(this.key);
    this.options = requestHeaderService.getOptions();
  }

  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  public getCollection(type: string, cb) {
    const collections = [];
    if (this.userId) {
      this.http
        .get(this.config.apiUrl + '/api/peers/' + this.userId + '/ownedCollections')
        .map((response: Response) => {
          const responseObj = response.json();
          console.log(response.json());
          responseObj.forEach((res) => {
            if (res.type === type) {
              collections.push(res);
            }
          });
          cb(null, collections);
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public getOwnedCollections(options: any, cb) {
    if (this.userId) {
      this.http
        .get(this.config.apiUrl + '/api/peers/' + this.userId + '/ownedCollections?' + 'filter=' + options)
        .map((response) => {
          console.log(response.json());
          cb(null, response.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public getCollectionDetails(id: string) {
    return this.http
      .get(this.config.apiUrl + '/api/collections/' + id)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  public getCollectionDetail(id: string, param: any) {
    const filter = JSON.stringify(param);
    return this.http
      .get(this.config.apiUrl + '/api/collections/' + id + '?filter=' + filter)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  /**
   * postCollection
   */
  public postCollection(type: string) {
    const body = {
      'type': type
    };
    return this.http.post(this.config.apiUrl + '/api/peers/'
      + this.userId + '/ownedCollections', body, this.options).map(
      (response) => response.json(), (err) => {
        console.log('Error: ' + err);
      }
      );
  }

  /**
   * patchCollection
   */
  public patchCollection(collectionId: string, body: any) {
    return this.http.patch(this.config.apiUrl +
      '/api/collections/' + collectionId, body, this.options);
  }

  /**
   * deleteCollection
   */
  public deleteCollection(collectionId: string) {
    return this.http.delete(this.config.apiUrl +
      '/api/collections/' + collectionId);
  }

  /**
   * sanitize
   */
  public sanitize(collection: any) {
    delete collection.id;
    delete collection.createdAt;
    delete collection.isApproved;
    delete collection.isCanceled;
    delete collection.status;
    delete collection.updatedAt;
    return collection;
  }

  /**
   * removeParticipant
   */
  public removeParticipant(collectionId: string, participantId: string) {
    return this.http.delete(this.config.apiUrl +
      '/api/collections/' + collectionId + '/participants/rel/' + participantId);
  }

}
