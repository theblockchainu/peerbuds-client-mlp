import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import { TopicService } from '../../_services/topic/topic.service';
import _ from 'lodash';

@Component({
  selector: 'app-feed',
  templateUrl: './homefeed.component.html',
  styleUrls: ['./homefeed.component.scss']
})
export class HomefeedComponent implements OnInit {
  public workshops: Array<any>;
  public userId: string;
  public peers: Array<any>;
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
    this.fetchWorkshops();
    this.fetchPeers();
  }

  fetchWorkshops() {
    const query = {
      'include': [
        { 'collections': ['reviews'] }
      ]
    };

    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.workshops = [];
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.reviews) {
              collection.rating = this._collectionService.calculateRating(collection.reviews);
            }
            this.workshops.push(collection);
          });
        }
        this.workshops = _.uniqBy(this.workshops, 'id');
        this.workshops = _.chunk(this.workshops, 5)[0];

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
      'limit': 6
    };
    this._profileService.getAllPeers(query).subscribe((result) => {
      this.peers = [];
      for (const responseObj of result.json()) {
        if (responseObj.id !== this.userId) {
          responseObj.rating = this._collectionService.calculateRating(responseObj.reviewsAboutYou);
          this.peers.push(responseObj);
        }
      }
    }, (err) => {
      console.log(err);
    });
  }


}
