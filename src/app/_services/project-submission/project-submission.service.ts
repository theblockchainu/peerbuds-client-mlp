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
export class ProjectSubmissionService {
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

  public submitProject(contentId: any, body: any) {
    if (this.userId) {
      return this.http.post(this.config.apiUrl + '/api/contents/' + contentId + '/submissions', body, this.options);
    }
  }

  public editProject(contentId: any, body: any) {
    if (this.userId) {
      return this.http.put(this.config.apiUrl + '/api/contents/' + contentId + '/submissions', body, this.options);
    }
  }

  public saveSubmissionTags(submissionId, body: any) {
    if (this.userId) {
      return this.http.patch(this.config.apiUrl + '/api/submissions/' + submissionId + '/topics', body, this.options);
    }
  }

  public viewSubmission(submissionId, query: any) {
    if (this.userId) {
      return this.http.get(this.config.apiUrl + '/api/submissions/' + submissionId + '?filter=' + query);
    }
  }

  public addPeerSubmissionRelation(submissionId) {
    if (this.userId) {
      return this.http.put(this.config.apiUrl + '/api/submissions/' + submissionId + '/peer/rel/' + this.userId, null, this.options);
    }
  }

  getUserId() {
    return this.getCookieValue(this.key);
  }

    /**
     * Add submission upvote
     * @param replyId
     * @param upvoteBody
     * @returns {Observable<Response>}
     */
    public addSubmissionUpvote(submissionId, upvoteBody) {
        return this.http
            .post(this.config.apiUrl + '/api/submissions/' + submissionId + '/upvotes', upvoteBody, this.options);
    }
}
