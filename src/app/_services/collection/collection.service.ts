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
declare var moment: any;

@Injectable()
export class CollectionService {
  public key = 'userId';
  private userId;
  public options;
  public now: Date;
  constructor(private http: Http, private config: AppConfig,
    private _cookieService: CookieService,
    private route: ActivatedRoute,
    public router: Router,
    private requestHeaderService: RequestHeaderService) {
    this.userId = this.getCookieValue(this.key);
    this.options = requestHeaderService.getOptions();
    this.now = new Date();
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

  public getParticipatingCollections(options: any, cb) {
    if (this.userId) {
      this.http
        .get(this.config.apiUrl + '/api/peers/' + this.userId + '/collections?' + 'filter=' + options)
        .map((response) => {
          console.log(response.json());
          cb(null, response.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public getAllCollections(options: any) {
    return this.http
      .get(this.config.apiUrl + '/api/collections?' + 'filter=' + JSON.stringify(options))
      .map(response => response.json());
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
   * delete Calendar
   */
  public deleteCalendar(calendarId: string) {
    return this.http.delete(this.config.apiUrl +
      '/api/calendars/' + calendarId);
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
  /* Submit workshop for Review */
  public submitForReview(id: string) {
    return this.http.post(this.config.apiUrl + '/api/collections/' + id + '/submitForReview', {}, this.options).map(
      (response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }
  /**
   * Filter only complete collections
   * @param collections
   */
  public filerCompleteCollections(collections: any) {
    return collections.filter(collection => {
      return collection.status === 'complete';
    });
  }

  /**
   * calculate number of days of a workshop
   */
  public calculateNumberOfDays(calendar) {
    if (calendar === undefined) {
      return 'No Calendar';
    } else {
      const a = moment(calendar.startDate);
      const b = moment(calendar.endDate);
      return b.diff(a, 'days');
    }
  }

  /**
   * Get difference in days
   */
  public getDaysBetween(startDate, endDate) {
    const a = moment(startDate);
    const b = moment(endDate);
    const diff = b.diff(a, 'days');
    switch (true) {
      case diff === 0:
        return 'today';
      case diff === 1:
        return 'yesterday';
      case diff > 1 && diff < 7:
        return diff + ' days ago';
      case diff >= 7 && diff < 30:
        return Math.floor(diff / 7) + ' weeks ago';
      case diff >= 30 && diff < 365:
        return Math.floor(diff / 30) + ' months ago';
      case diff >= 365:
        return Math.floor(diff / 365) + ' years ago';
      default:
        return diff + ' days ago';
    }
  }

  /**
   * Get the most upcoming content details
   */
  public getUpcomingEvent(collection) {
    const contents = collection.contents;
    const calendars = collection.calendars;
    const currentCalendar = this.getCurrentCalendar(calendars);
    contents.sort((a, b) => {
      if (a.schedules[0].startDay < b.schedules[0].startDay) {
        return -1;
      }
      if (a.schedules[0].startDay > b.schedules[0].startDay) {
        return 1;
      }
      return 0;
    }).filter((element, index) => {
      return moment() < moment(element.startDay);
    });
    let fillerWord = '';
    if (contents[0].type === 'online') {
      fillerWord = 'session';
    } else if (contents[0].type === 'video') {
      fillerWord = 'recording';
    } else if (contents[0].type === 'project') {
      fillerWord = 'submission';
    }
    const contentStartDate = moment(currentCalendar.startDate).add(contents[0].schedules[0].startDay, 'days');
    const timeToStart = contentStartDate.diff(moment(), 'days');
    contents[0].timeToStart = timeToStart;
    contents[0].fillerWord = fillerWord;
    contents[0].hasStarted = false;
    return contents[0];
  }

  /**
   * Get the full name of any content type
   * @param contentType
   * @returns {string}
   */
  public getContentTypeFullName(contentType) {
    let fillerWord = '';
    if (contentType === 'online') {
      fillerWord = 'session';
    } else if (contentType === 'video') {
      fillerWord = 'recording';
    } else if (contentType === 'project') {
      fillerWord = 'submission';
    }
    return contentType + ' ' + fillerWord;
  }

  /**
   * Get the current active calendar of this collection
   * @param calendars
   */
  public getCurrentCalendar(calendars) {
    calendars = calendars.sort((a, b) => {
      if (moment(a.startDate) < moment(b.startDate)) {
        return -1;
      }
      if (moment(a.startDate) > moment(b.startDate)) {
        return 1;
      }
      return 0;
    }).filter((element, index) => {
      return moment() < moment(element.endDate);
    });
    return calendars[0];
  }

  /**
   * Get the progress bar value of this workshop
   * @param workshop
   * @returns {number}
   */
  public getProgressValue(workshop) {
    let value = 0;
    switch (workshop.status) {
      case 'draft':
        if (workshop.title !== undefined && workshop.title.length > 0) {
          value += 10;
        }
        if (workshop.headline !== undefined && workshop.headline.length > 0) {
          value += 10;
        }
        if (workshop.description !== undefined && workshop.description.length > 0) {
          value += 10;
        }
        if (workshop.videoUrls !== undefined && workshop.videoUrls.length > 0) {
          value += 10;
        }
        if (workshop.imageUrls !== undefined && workshop.imageUrls.length > 0) {
          value += 10;
        }
        if (workshop.price !== undefined && workshop.price.length > 0) {
          value += 10;
        }
        if (workshop.aboutHost !== undefined && workshop.aboutHost.length > 0) {
          value += 10;
        }
        if (workshop.cancellationPolicy !== undefined && workshop.cancellationPolicy.length > 0) {
          value += 10;
        }
        if (workshop.contents !== undefined && workshop.contents.length > 0) {
          value += 10;
        }
        if (workshop.topics !== undefined && workshop.topics.length > 0) {
          value += 10;
        }
        return value;
      case 'active':
        if (this.getCurrentCalendar(workshop.calendars).startDate > this.now) {
          return 0;
        }
        const totalContents = workshop.contents.length;
        let pendingContents = 0;
        workshop.contents.forEach((content) => {
          if (moment(this.getCurrentCalendar(workshop.calendars).startDate).add(content.schedules[0].startDay, 'days') > this.now) {
            pendingContents++;
          }
        });
        return (1 - (pendingContents / totalContents)) * 100;
      case 'submitted':
        return 100;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  }

  /**
   *  Workshop
   */
  public viewWorkshop(collection) {
    this.router.navigate(['workshop', collection.id]);
  }

  /**
   * viewExperience
   */
  public viewExperience(collection) {
    this.router.navigate(['experience', collection.id]);
  }

  /**
   * viewSession
   */
  public viewSession(collection) {
    this.router.navigate(['session', collection.id]);
  }

  /**
   *  Workshop
   */
  public openEditWorkshop(collection) {
    this.router.navigate(['workshop', collection.id, 'edit', collection.stage.length > 0 ? collection.stage : 1]);
  }

  /**
   * viewExperience
   */
  public openEditExperience(collection) {
    this.router.navigate(['experience', collection.id, 'edit', collection.stage.length > 0 ? collection.stage : 1]);
  }

  /**
   * viewSession
   */
  public openEditSession(collection) {
    this.router.navigate(['session', collection.id, 'edit', collection.stage.length > 0 ? collection.stage : 1]);
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

  /**
   * View all transactions for this teacher
   */
  public viewTransactions() {
    this.router.navigate(['/console/account/transactions']);
  }

  public sendVerifySMS(phoneNo) {
    const body = {};
    return this.http
      .post(this.config.apiUrl + '/api/peers/sendVerifySms?phone=' + phoneNo, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  public confirmSmsOTP(inputToken) {
    const body = {};
    return this.http
      .post(this.config.apiUrl + '/api/peers/confirmSmsOTP?token=' + inputToken, body, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });

  }

  /**
   * getRecommendations
   */
  public getRecommendations(query) {
    const filter = JSON.stringify(query);
    return this.http
      .get(this.config.apiUrl + '/api/collections?' + 'filter=' + filter, this.options);
  }

  /**
   * getParticipants
   */
  public getParticipants(collectionId, query) {
    const filter = JSON.stringify(query);
    return this.http
      .get(this.config.apiUrl + '/api/collections/' + collectionId + '/participants?filter=' + filter, this.options);
  }

  /**
   * addParticipant
collectionID:string,userId:string,calendarId:string   */
  public addParticipant(collectionId: string, userId: string, calendarId: string, cb) {
    const body = {
      'calendarId': calendarId
    };
    this.http
      .put(this.config.apiUrl + '/api/collections/' + collectionId + '/participants/rel/' + userId, body, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }


  /**
   * Approve this collection
   * @param collection
   * @returns {Observable<any>}
   */
  public approveCollection(collection) {
    return this.http.post(this.config.apiUrl + '/api/collections/' + collection.id + '/approve', {}, this.options).map(
      (response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  /**
   * open a collection view page based on its type
   * @param collection
   */
  public openCollection(collection) {
    switch (collection.type) {
      case 'workshop':
        this.router.navigate(['/workshop', collection.id]);
        break;
      case 'experience':
        this.router.navigate(['/experience', collection.id]);
        break;
      case 'session':
        this.router.navigate(['/session', collection.id]);
        break;
      default:
        this.router.navigate(['/workshop', collection.id]);
        break;
    }
  }

  /**
   * open a collection view page based on its type
   * @param collection
   */
  public openEditCollection(collection) {
    switch (collection.type) {
      case 'workshop':
        this.router.navigate(['/workshop', collection.id, 'edit', collection.stage]);
        break;
      case 'experience':
        this.router.navigate(['/experience', collection.id, 'edit', collection.stage]);
        break;
      case 'session':
        this.router.navigate(['/session', collection.id, 'edit', collection.stage]);
        break;
      default:
        this.router.navigate(['/workshop', collection.id, 'edit', collection.stage]);
        break;
    }
  }

  public postCalendars(id, calendars) {
    return this.http
      .post(this.config.apiUrl + '/api/collections/' + id + '/calendars', calendars, this.options)
      .map((response: Response) => response.json(), (err) => {
        console.log('Error: ' + err);
      });
  }

  /**
   * getComments
   */
  public getComments(workshopId: string, query: any, cb) {
    const filter = JSON.stringify(query);
    this.http
      .get(this.config.apiUrl + '/api/collections/' + workshopId + '/comments' + '?filter=' + filter, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * get comments of given content
   * @param {string} contentId
   * @param query
   * @param cb
   */
  public getContentComments(contentId: string, query: any, cb) {
    const filter = JSON.stringify(query);
    this.http
      .get(this.config.apiUrl + '/api/contents/' + contentId + '/comments' + '?filter=' + filter, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * get comments of given submission
   * @param {string} submissionId
   * @param query
   * @param cb
   */
  public getSubmissionComments(submissionId: string, query: any, cb) {
    const filter = JSON.stringify(query);
    this.http
      .get(this.config.apiUrl + '/api/submissions/' + submissionId + '/comments' + '?filter=' + filter, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  public getReviews(peerId: string, query: any, cb) {
    const filter = JSON.stringify(query);
    this.http
      .get(this.config.apiUrl + '/api/peers/' + peerId + '/reviewsAboutYou' + '?filter=' + filter, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * postComments
  worrkshopID   */
  public postComments(workshopId: string, commentBody: any, cb) {
    this.http
      .post(this.config.apiUrl + '/api/collections/' + workshopId + '/comments', commentBody, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * Post a comment on submission
   * @param {string} submissionId
   * @param commentBody
   * @param cb
   */
  public postSubmissionComments(submissionId: string, commentBody: any, cb) {
    this.http
      .post(this.config.apiUrl + '/api/submissions/' + submissionId + '/comments', commentBody, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * post a comment on content
   * @param {string} contentId
   * @param commentBody
   * @param cb
   */
  public postContentComments(contentId: string, commentBody: any, cb) {
    this.http
      .post(this.config.apiUrl + '/api/contents/' + contentId + '/comments', commentBody, this.options)
      .map((response) => {
        cb(null, response.json());
      }, (err) => {
        cb(err);
      }).subscribe();
  }

  /**
   * postReview
   */
  public postReview(peerId: string, reviewBody: any) {
    return this.http
      .post(this.config.apiUrl + '/api/peers/' + peerId + '/reviewsAboutYou', reviewBody, this.options);
  }

  public calculateRating(reviewArray?: any) {
    let reviewScore = 0;
    for (const reviewObject of reviewArray) {
      reviewScore += reviewObject.score;
    }
    return (reviewScore / (reviewArray.length * 5)) * 5;
  }

  public calculateCollectionRating(collectionId, reviewArray?: any) {
    let reviewScore = 0;
    for (const reviewObject of reviewArray) {
      if (reviewObject.collectionId !== undefined && reviewObject.collectionId === collectionId)
        reviewScore += reviewObject.score;
    }
    return (reviewScore / (reviewArray.length * 5)) * 5;
  }

  public calculateCollectionRatingCount(collectionId, reviewArray?: any) {
    let reviewCount = 0;
    for (const reviewObject of reviewArray) {
      if (reviewObject.collectionId !== undefined && reviewObject.collectionId === collectionId)
        reviewCount++;
    }
    return reviewCount;
  }

  public imgErrorHandler(event) {
    event.target.src = '/assets/images/placeholder-image.jpg';
  }

}
