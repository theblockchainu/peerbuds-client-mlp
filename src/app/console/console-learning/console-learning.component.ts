import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { ConsoleComponent } from '../console.component';
import { CookieService } from 'ngx-cookie-service';

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
  private userId;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService,
    public consoleComponent: ConsoleComponent,
    public _cookieService: CookieService,
    private _cookieUtilsService: CookieUtilsService) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.activeTab = 'all';
    this.now = new Date();
    this.userId = _cookieUtilsService.getValue('userId');
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
      if (joinedCalendar) {
        return moment(joinedCalendar.startDate).format('Do MMM') + ' - ' + moment(joinedCalendar.endDate).format('Do MMM');
      } else {
        return null;
      }
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
    switch (workshop.status) {
      case 'active':
        if (this.getLearnerCalendar(workshop)) {
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
          return (1 - (pendingContents / totalContents)) * 100;

        } else {
          return 0;
        }
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


  imgErrorHandler(event) {
    event.target.src = '/assets/images/user-placeholder.jpg';
  }

}
