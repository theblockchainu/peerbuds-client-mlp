import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { TopicService } from '../../_services/topic/topic.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { SelectTopicsComponent } from './select-topics/select-topics.component';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {
  public availableTopics: Array<any>;
  public userId: string;
  public workshops: Array<any>;
  public selectedTopics: Array<any>;
  @ViewChild('menuButton') menuButton;

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
    this.fetchTopics();
    this.fetchWorkshops();
  }


  fetchTopics() {
    const query = {};
    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.availableTopics = [];
        response.json().forEach(topic => {
          this.availableTopics.push({ 'topic': topic, 'checked': false });
        });
      }, (err) => {
        console.log(err);
      }
    );
  }

  fetchWorkshops(availableTopics?: Array<string>) {
    let query;
    if (availableTopics) {
      this.selectedTopics = [];
      for (const topicObj of availableTopics) {
        if (topicObj['checked']) {
          this.selectedTopics.push({ 'name': topicObj['topic'].name });
        }
      }
      query = {
        'include': [
          { 'collections': ['reviews'] }
        ],
        'where': { or: this.selectedTopics }
      };
    } else {
      query = {
        'include': [
          { 'collections': ['reviews'] }
        ]
      };
    }

    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.workshops = [];
        for (const responseObj of response.json()) {
          responseObj.collections.forEach(collection => {
            if (collection.reviews) {
              collection.rating = this._collectionService.calculateRating(collection.reviews);
            }
            this.workshops.push(collection);
          });
        }
        this.workshops = _.uniqBy(this.workshops, 'id');
      }, (err) => {
        console.log(err);
      }
    );
  }

  openTopicsDialog(): void {
    const dialogRef = this.dialog.open(SelectTopicsComponent, {
      width: '250px',
      data: this.availableTopics,
      disableClose: true,
      position: {
        top: this.menuButton._elementRef.nativeElement.getBoundingClientRect().top + 'px',
        left: this.menuButton._elementRef.nativeElement.getBoundingClientRect().left + 'px'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.availableTopics = result;
        this.fetchWorkshops(this.availableTopics);
      }
    });
  }

}
