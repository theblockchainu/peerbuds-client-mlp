import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import { TopicService } from '../../_services/topic/topic.service';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-feed',
  templateUrl: './homefeed.component.html',
  styleUrls: ['./homefeed.component.scss']
})
export class HomefeedComponent implements OnInit {
  public workshops: Array<any>;
  public experiences: Array<any>;
  public userId;
  public peers: Array<any>;
  public loadingWorkshops = false;
  public loadingExperiences = false;
  public loadingPeers = false;
  public loadingContinueLearning = false;
  private today = moment();

  public ongoingArray: Array<any>;
  public upcomingArray: Array<any>;
  public pastArray: Array<any>;
  public pastWorkshopsObject: any;
  public liveWorkshopsObject: any;
  public upcomingWorkshopsObject: any;
  public now: Date;

  constructor(
    public _collectionService: CollectionService,
    public _profileService: ProfileService,
    private _cookieUtilsService: CookieUtilsService,
    public config: AppConfig,
    private _topicService: TopicService
  ) {
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.fetchContinueLearning();
    this.fetchWorkshops();
    this.fetchExperiences();
    this.fetchPeers();
  }

  private fetchContinueLearning() {
      this.loadingContinueLearning = true;
      this._collectionService.getParticipatingCollections(this.userId, '{ "relInclude": "calendarId", "where": {"type":"workshop"}, "include": ["calendars", {"owners":["profiles", "reviewsAboutYou", "ownedCollections"]}, {"participants": "profiles"}, "topics", {"contents":["schedules","views","submissions"]}, {"reviews":"peer"}] }', (err, result) => {
          if (err) {
              console.log(err);
          } else {
              this.ongoingArray = [];
              this.upcomingArray = [];
              this.liveWorkshopsObject = {};
              this.upcomingWorkshopsObject = {};
              this.createOutput(result);
              this.now = new Date();
              this.loadingContinueLearning = false;
          }
      });
  }

  private createOutput(data: any) {
      const now = moment();
      data.forEach(workshop => {
          workshop.calendars.forEach(calendar => {
              if (workshop.calendarId === calendar.id && calendar.endDate) {
                  if (now.diff(moment.utc(calendar.endDate)) < 0) {
                      if (now.isBetween(calendar.startDate, calendar.endDate)) {
                          if (workshop.id in this.liveWorkshopsObject) {
                              this.liveWorkshopsObject[workshop.id]['workshop']['calendars'].push(calendar);
                          } else {
                              this.liveWorkshopsObject[workshop.id] = {};
                              this.liveWorkshopsObject[workshop.id]['workshop'] = _.clone(workshop);
                              this.liveWorkshopsObject[workshop.id]['workshop']['calendars'] = [calendar];
                          }
                      }
                  }
              }
          });
      });

      for (const key in this.liveWorkshopsObject) {
          if (this.liveWorkshopsObject.hasOwnProperty(key)) {
              this.ongoingArray.push(this.liveWorkshopsObject[key].workshop);
          }
      }
  }

  public compareCalendars(a, b) {
      return moment(a.startDate).diff(moment(b.startDate), 'days');
  }

  /**
   * Get the most upcoming content details
   */
  public getLearnerUpcomingEvent(collection) {
      const contents = collection.contents;
      const calendars = collection.calendars;
      const currentCalendar = this.getLearnerCalendar(collection);
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
      if (contents[0].type === 'online')
          fillerWord = 'session';
      else if (contents[0].type === 'video')
          fillerWord = 'recording';
      else if (contents[0].type === 'project')
          fillerWord = 'submission';
      if (currentCalendar) {
          const contentStartDate = moment(currentCalendar.startDate).add(contents[0].schedules[0].startDay, 'days');
          const timeToStart = contentStartDate.diff(moment(), 'days');
          contents[0].timeToStart = timeToStart;
      } else {
          contents[0].timeToStart = 0;
      }
      contents[0].fillerWord = fillerWord;
      contents[0].hasStarted = false;
      return contents[0];
  }

  /**
   * get calendar signed up by this learner
   */
  public getLearnerCalendar(collection) {
      if (collection.calendarId === undefined) {
          return null;
      } else {
          return collection.calendars.find((calendar) => {
              return calendar.id === collection.calendarId;
          });
      }
  }

  fetchWorkshops() {
    const query = {
      'include': [
        { 'collections': [{'owners': ['reviewsAboutYou', 'profiles']}, 'calendars'] }
      ],
      'order': 'createdAt desc'
    };
    this.loadingWorkshops = true;
    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.loadingWorkshops = false;
        this.workshops = [];
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.status === 'active') {
              if (collection.owners && collection.owners[0].reviewsAboutYou) {
                collection.rating = this._collectionService.calculateCollectionRating(collection.id, collection.owners[0].reviewsAboutYou);
                collection.ratingCount = this._collectionService.calculateCollectionRatingCount(collection.id, collection.owners[0].reviewsAboutYou);
              }
              let hasActiveCalendar = false;
              if(collection.calendars) {
                collection.calendars.forEach(calendar => {
                  if (moment(calendar.startDate).diff(this.today, 'days') >= -1) {
                    hasActiveCalendar = true;
                    return;
                  }
                });
              }
              if (hasActiveCalendar) {
                this.workshops.push(collection);
              }
            }
          });
        }
        this.workshops = _.uniqBy(this.workshops, 'id');
        this.workshops = _.orderBy(this.workshops, ['createdAt'], ['desc']);
        this.workshops = _.chunk(this.workshops, 5)[0];

      }, (err) => {
        console.log(err);
      }
    );
  }

  fetchExperiences() {
    const query = {
      'include': [
        { 'collections': [{'owners': 'reviewsAboutYou'}, 'calendars'] }
      ],
      'order': 'createdAt desc'
    };
    this.loadingExperiences = true;
    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.loadingWorkshops = false;
        this.experiences = [];
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.status === 'active') {
              if (collection.owners && collection.owners[0].reviewsAboutYou) {
                collection.rating = this._collectionService.calculateCollectionRating(collection.id, collection.owners[0].reviewsAboutYou);
                collection.ratingCount = this._collectionService.calculateCollectionRatingCount(collection.id, collection.owners[0].reviewsAboutYou);
              }
              let hasActiveCalendar = false;
              if(collection.calendars) {
                collection.calendars.forEach(calendar => {
                  if (moment(calendar.startDate).diff(this.today, 'days') >= -1) {
                    hasActiveCalendar = true;
                    return;
                  }
                });
              }
              if (hasActiveCalendar) {
                this.experiences.push(collection);
              }
            }
          });
        }
        this.experiences = _.uniqBy(this.experiences, 'id');
        this.experiences = _.orderBy(this.experiences, ['createdAt'], ['desc']);
        this.experiences = _.chunk(this.experiences, 5)[0];

      }, (err) => {
        console.log(err);
      }
    );
  }


  fetchPeers() {
    const query = {
      'include': [
        'reviewsAboutYou',
        'profiles'
      ],
      'where': {
        'id': { 'neq': this.userId }
      },
      'limit': 6,
      'order': 'createdAt desc'
    };
    this.loadingPeers = true;
    this._profileService.getAllPeers(query).subscribe((result) => {
      this.loadingPeers = false;
      this.peers = [];
      for (const responseObj of result.json()) {
        responseObj.rating = this._collectionService.calculateRating(responseObj.reviewsAboutYou);
        this.peers.push(responseObj);
      }
    }, (err) => {
      console.log(err);
    });
  }
}

