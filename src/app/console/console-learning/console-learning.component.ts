import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';
import {ConsoleComponent} from '../console.component';
import {CookieService} from 'ngx-cookie-service';

declare var moment: any;

@Component({
  selector: 'app-console-learning',
  templateUrl: './console-learning.component.html',
  styleUrls: ['./console-learning.component.scss', '../console.component.scss']
})
export class ConsoleLearningComponent implements OnInit {

  public workshops: any;
  public loaded: boolean;
  public activeTab: string;
  public now: Date;
  public key = 'userId';
  private userId;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService,
    public consoleComponent: ConsoleComponent,
    public _cookieService: CookieService) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.activeTab = 'all';
    this.now = new Date();
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

  ngOnInit() {
    this.loaded = false;
  }

  /**
   * createWorkshop
   */
  public viewReceipt(collection) {
    this.router.navigate(['receipt']);
  }

  /**
   * Check if the given tab is active tab
   * @param tabName
   * @returns {boolean}
   */
  public getActiveTab() {
    return this.activeTab;
  }

  /**
   * Set activeTab value
   * @param value
   */
  public setActiveTab(value) {
    this.activeTab = value;
  }


  /**
   * calculate number of days of a workshop
   */
  public getThisCollectionDate(collection) {
    if (collection.calendarId === undefined) {
      return ' ';
    } else {
      const joinedCalendar = collection.calendars.find((calendar) => {
        return calendar.id === collection.calendarId;
      });
      return moment(joinedCalendar.startDate).format('Do MMM') + ' - ' + moment(joinedCalendar.endDate).format('Do MMM');
    }
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
    const contentStartDate = moment(currentCalendar.startDate).add(contents[0].schedules[0].startDay, 'days');
    const timeToStart = contentStartDate.diff(moment(), 'days');
    contents[0].timeToStart = timeToStart;
    contents[0].fillerWord = fillerWord;
    contents[0].hasStarted = false;
    return contents[0];
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
        if (this.getLearnerCalendar(workshop).startDate > this.now) {
          return 0;
        }
        const totalContents = workshop.contents.length;
        let pendingContents = 0;
        workshop.contents.forEach((content) => {
          if (moment(this.getLearnerCalendar(workshop).startDate).add(content.schedules[0].startDay, 'days') > this.now) {
            pendingContents++;
          }
        });
        return ( 1 - (pendingContents / totalContents) ) * 100;
      case 'submitted':
        return 100;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  }

  public peerHasReview(collection) {
    return collection.reviews.some((review) => {
      return review.peer[0].id === this.userId;
    });
  }

  /**
   * viewWorkshop
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

}
