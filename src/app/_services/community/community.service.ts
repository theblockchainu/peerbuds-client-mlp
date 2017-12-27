import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AppConfig} from '../../app.config';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import {RequestHeaderService} from '../requestHeader/request-header.service';

@Injectable()
export class CommunityService {

    public key = 'userId';
    public options;
    public now: Date;

    constructor(private http: Http,
                private config: AppConfig,
                private _cookieService: CookieService,
                private route: ActivatedRoute,
                public router: Router,
                private authService: AuthenticationService,
                private requestHeaderService: RequestHeaderService) {
        this.options = requestHeaderService.getOptions();
        this.now = new Date();
    }

    public getCommunityDetail(id: string, param: any) {
        const filter = JSON.stringify(param);
        return this.http
            .get(this.config.apiUrl + '/api/communities/' + id + '?filter=' + filter)
            .map((response: Response) => response.json(), (err) => {
                console.log('Error: ' + err);
            });

    }

    /**
     * getParticipants
     */
    public getParticipants(communityId, query) {
        const filter = JSON.stringify(query);
        return this.http
            .get(this.config.apiUrl + '/api/communities/' + communityId + '/participants?filter=' + filter, this.options);
    }

    /**
     * addParticipant
     collectionID:string,userId:string,calendarId:string
     */
    public addParticipant(communityId: string, userId: string, cb) {
        const body = {};
        this.http
            .put(this.config.apiUrl + '/api/communities/' + communityId + '/participants/rel/' + userId, body, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }

    /**
     * removeParticipant
     */
    public removeParticipant(communityId: string, participantId: string) {
        return this.http.delete(this.config.apiUrl +
            '/api/communities/' + communityId + '/participants/rel/' + participantId);
    }

    /**
     * getComments
     */
    public getComments(communityId: string, query: any, cb) {
        const filter = JSON.stringify(query);
        this.http
            .get(this.config.apiUrl + '/api/communities/' + communityId + '/comments' + '?filter=' + filter, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }

    /**
     * postComments
     worrkshopID   */
    public postComments(communityId: string, commentBody: any, cb) {
        this.http
            .post(this.config.apiUrl + '/api/communities/' + communityId + '/comments', commentBody, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }

    /**
     * Get questions within a community
     * @param {string} communityId
     * @param query
     * @param cb
     */
    public getQuestions(communityId: string, query: any, cb) {
        const filter = JSON.stringify(query);
        this.http
            .get(this.config.apiUrl + '/api/communities/' + communityId + '/questions' + '?filter=' + filter, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }


    /**
     * Add a new quesiton to this community
     * @param {string} communityId
     * @param questionBody
     * @returns {Observable<Response>}
     */
    public postQuestion(communityId: string, questionBody: any) {
        return this.http
            .post(this.config.apiUrl + '/api/communities/' + communityId + '/questions', questionBody, this.options);
    }


    /**
     * Delete a question from database
     * @param {string} questionId
     * @returns {Observable<Response>}
     */
    public deleteQuestion(questionId: string) {
        return this.http
            .delete(this.config.apiUrl + '/api/questions/' + questionId, this.options);
    }


    public imgErrorHandler(event) {
        event.target.src = '/assets/images/placeholder-image.jpg';
    }

    public userImgErrorHandler(event) {
        event.target.src = '/assets/images/user-placeholder.jpg';
    }

    /**
     *  View community
     */
    public viewCommunity(community) {
        this.router.navigate(['community', community.id]);
    }

    /**
     * open edit community
     */
    public openEditCommunity(community) {
        this.router.navigate(['community', community.id, 'edit', community.stage.length > 0 ? community.stage : 1]);
    }

    /**
     * Get text to show in action button of draft card
     * @param status
     * @returns {any}
     */
    public getDraftButtonText(status) {
        switch (status) {
            case 'draft':
                return 'Continue Editing';
            case 'submitted':
                return 'Edit Details';
            default:
                return 'Continue Editing';
        }
    }

    public saveBookmark(communityId, cb) {
        const body = {};
        this.http
            .post(this.config.apiUrl + '/api/communities/' + communityId + '/bookmarks', body, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }

    public removeBookmark(bookmarkId, cb) {
        const body = {};
        this.http
            .delete(this.config.apiUrl + '/api/bookmarks/' + bookmarkId, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }

    /**
     * getBookmarks
     */
    public getBookmarks(communityId: string, query: any, cb) {
        const filter = JSON.stringify(query);
        this.http
            .get(this.config.apiUrl + '/api/communities/' + communityId + '/bookmarks' + '?filter=' + filter, this.options)
            .map((response) => {
                cb(null, response.json());
            }, (err) => {
                cb(err);
            }).subscribe();
    }


    /**
     * Delete the entire community
     * @param {string} communityId
     * @returns {Observable<Response>}
     */
    public deleteCommunity(communityId: string) {
        return this.http.delete(this.config.apiUrl +
            '/api/communities/' + communityId);
    }

}
