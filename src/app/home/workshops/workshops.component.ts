import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { TopicService } from '../../_services/topic/topic.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { SelectTopicsComponent } from '../dialogs/select-topics/select-topics.component';
import { SelectPriceComponent } from '../dialogs/select-price/select-price.component';
import 'rxjs/add/operator/do';
import * as moment from 'moment';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {
  public availableTopics: Array<any>;
  public userId;
  public workshops: Array<any>;
  @ViewChild('topicButton') topicButton;
  @ViewChild('priceButton') priceButton;
  public availableRange: Array<number>;
  public selectedRange: Array<number>;
  public initialized: boolean;
  public selectedTopics: Array<any>;
  public loading = false;
  private today = moment();

  constructor(
    public _collectionService: CollectionService,
    public _profileService: ProfileService,
    private _cookieUtilsService: CookieUtilsService,
    private _topicService: TopicService,
    public config: AppConfig,
    public dialog: MdDialog,
    public elRef: ElementRef
  ) {
    this.userId = _cookieUtilsService.getValue('userId');
  }
  ngOnInit() {
    this.fetchData().subscribe();
  }

  fetchData(): Observable<any> {
    this.loading = true;
    return this.fetchTopics().map(
      response => {
        this.loading = false;
        this.availableTopics = response;
        this.fetchWorkshops();
      }, err => {
        this.loading = false;
        console.log(err);
      });
  }

  setPriceRange(): void {
    if (this.workshops.length > 0) {
      this.availableRange = [
        _.minBy(this.workshops, function (o) {
          return o.price;
        }).price,
        _.maxBy(this.workshops, function (o) { return o.price; }).price
      ];
      this.selectedRange = _.clone(this.availableRange);
    }
  }

  fetchTopics(): Observable<Array<any>> {
    const query = {};
    return this._topicService.getTopics(query).map(
      (response) => {
        const availableTopics = [];
        response.forEach(topic => {
          availableTopics.push({ 'topic': topic, 'checked': false });
        });
        return availableTopics;
      }, (err) => {
        console.log(err);
      }
    );
  }

  fetchWorkshops(): void {
    let query;
    this.selectedTopics = [];
    for (const topicObj of this.availableTopics) {
      if (topicObj['checked']) {
        this.selectedTopics.push({ 'name': topicObj['topic'].name });
      }
    }
    if (this.selectedTopics.length < 1) {
      for (const topicObj of this.availableTopics) {
        this.selectedTopics.push({ 'name': topicObj['topic'].name });
      }
    }
    query = {
      'include': [
        { 'collections': [{'owners': 'reviewsAboutYou'}, 'calendars'] }
      ],
      'where': { or: this.selectedTopics }
    };

    this._topicService.getTopics(query)
      .subscribe(
      (response) => {
        const workshops = [];
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.status === 'active') {
                if (collection.owners && collection.owners[0].reviewsAboutYou) {
                    collection.rating = this._collectionService.calculateCollectionRating(collection.id, collection.owners[0].reviewsAboutYou);
                    collection.ratingCount = this._collectionService.calculateCollectionRatingCount(collection.id, collection.owners[0].reviewsAboutYou);
                }
                let hasActiveCalendar = false;
                collection.calendars.forEach(calendar => {
                    if (moment(calendar.startDate).diff(this.today, 'days') >= -1) {
                        hasActiveCalendar = true;
                        return;
                    }
                });
                if (collection.price && hasActiveCalendar) {
                    if (this.selectedRange) {
                        if (collection.price >= this.selectedRange[0] && collection.price <= this.selectedRange[1]) {
                            workshops.push(collection);
                        }
                    } else {
                        workshops.push(collection);
                    }
                } else {
                    console.log('price unavailable');
                }
            }
          });
        }
        this.workshops = _.uniqBy(workshops, 'id');
        this.workshops = _.orderBy(this.workshops, ['createdAt'], ['desc']);
        if (!this.initialized) {
          this.setPriceRange();
          this.initialized = true;
        }
      }, (err) => {
        console.log(err);
      }
      );
  }

  openTopicsDialog(): void {
    const dialogRef = this.dialog.open(SelectTopicsComponent, {
      width: '250px',
      height: '300px',
      data: this.availableTopics,
      disableClose: true,
      position: {
        top: this.topicButton._elementRef.nativeElement.getBoundingClientRect().top + 'px',
        left: this.topicButton._elementRef.nativeElement.getBoundingClientRect().left + 'px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.availableTopics = result;
        this.fetchWorkshops();
      }
    });
  }

  openPriceDialog(): void {
    const dialogRef = this.dialog.open(SelectPriceComponent, {
      width: '200px',
      height: '190px',
      data: {
        availableRange: this.availableRange,
        selectedRange: this.selectedRange
      },
      disableClose: true,
      position: {
        top: this.priceButton._elementRef.nativeElement.getBoundingClientRect().top + 'px',
        left: this.priceButton._elementRef.nativeElement.getBoundingClientRect().left + 'px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRange = result.selectedRange;
        this.fetchWorkshops();
      }
    });
  }
}
