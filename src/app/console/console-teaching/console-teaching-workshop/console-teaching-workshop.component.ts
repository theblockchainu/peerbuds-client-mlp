import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../../_services/collection/collection.service';

declare var moment: any;

@Component({
  selector: 'app-console-teaching-workshop',
  templateUrl: './console-teaching-workshop.component.html',
  styleUrls: ['./console-teaching-workshop.component.scss']
})
export class ConsoleTeachingWorkshopComponent implements OnInit {

  public workshops: any;
  public loaded: boolean;
  public now: Date;
  private outputResult: any;
  public activeTab: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService) {
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getOwnedCollections('{ "where": {"type":"workshop"}, "include": ["calendars", "owners", {"participants": "profiles"}, "topics", {"contents":"schedules"}] }', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let draftCount = 0, activeCount = 0, pastCount = 0;
        this.outputResult = {};
        this.outputResult['data'] = [];
        this.outputResult.draftCount = 0;
        this.outputResult.activeCount = 0;
        this.outputResult.pastCount = 0;
        result.forEach((resultItem) => {
          switch (resultItem.status) {
            case 'draft' || 'submitted':
              draftCount++;
              break;
            case 'active':
              activeCount++;
              break;
            case 'complete':
              pastCount++;
              break;
            default:
              break;
          }
          this.outputResult.data.push(resultItem);
        });
        this.outputResult.draftCount = draftCount;
        this.outputResult.activeCount = activeCount;
        this.outputResult.pastCount = pastCount;
        this.workshops = this.outputResult;
        console.log(this.workshops);
        this.now = new Date();
        this.loaded = true;
      }
    });
  }

  public onSelect(workshop) {
    this.router.navigate(['/editWorkshop/', workshop.id, 1]);
  }

  public showFinishingTouch(workshop) {
    this.router.navigate(['/finishTouch', workshop.id]);
  }

  /**
   * viewWorkshop
   */
  public viewWorkshop(workshop) {
    this.router.navigate(['workshop', workshop.id]);
  }

  /**
   * deleteWorkshop
   */
  public deleteWorkshop(workshop) {
    this._collectionService.deleteCollection(workshop.id).subscribe((deleteResult) => {
      this.router.navigate(['workshop-console']);
    });
  }

  /**
   * calculate number of days of a workshop
   */
  public calculateNumberOfDays(calendar) {
    const a = moment(calendar.startDate);
    const b = moment(calendar.endDate);
    return b.diff(a, 'days');
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

}
