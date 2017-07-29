import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
        , RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { CookieService } from 'angular2-cookie/core';

import { AppConfig } from '../../app.config';

@Injectable()
export class CollectionService {
  public key = 'userId';
  private userId ;

  constructor(private http: Http, private config: AppConfig,
              private _cookieService: CookieService,
              private route: ActivatedRoute,
              public router: Router) {
              this.userId = this.getCookieValue(this.key);

  }

  private getCookieValue(key: string) {
    let cookie = this._cookieService.get(key);
    if(cookie) {
      let cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  public getCollection(type: string) {
    let collections = [];
    if(this.userId) {
      this.http
               .get(this.config.apiUrl + '/api/peers/' + this.userId + '/collections')
               .map((response: Response) => {
                 // login successful if there's a jwt token in the response
                 let responseObj = response.json();
                 console.log(response.json());
                 responseObj.forEach((res) =>
                  {
                   if(res.type==type)
                    collections.push(res);
                  });
               }, (err) => {
                   console.log('Error: ' + err);
                }).subscribe();
              }

    return collections;
  }

  public getCollectionDetails(id: string){
    let collection = {};
    return this.http
             .get(this.config.apiUrl + '/api/collections/' + id)
             .map((response: Response) => response.json(), (err) => {
                 console.log('Error: ' + err);
              });

  }

}
