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
  public userId;
  public peers: Array<any>;
  public loadingWorkshops = false;
  public loadingPeers = false;
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
        { 'collections': [{'owners': 'reviewsAboutYou'}] }
      ]
    };
    this.loadingWorkshops = true;
    this._topicService.getTopics(query).subscribe(
      (response) => {
        this.loadingWorkshops = false;
        this.workshops = [];
        for (const responseObj of response) {
          responseObj.collections.forEach(collection => {
            if (collection.status === 'active') {
                if (collection.owners[0].reviewsAboutYou) {
                    collection.rating = this._collectionService.calculateCollectionRating(collection.id, collection.owners[0].reviewsAboutYou);
                    collection.ratingCount = this._collectionService.calculateCollectionRatingCount(collection.id, collection.owners[0].reviewsAboutYou);
                }
                this.workshops.push(collection);
            }
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
      'where': {
        'id': {'neq': this.userId}
      },
      'limit': 6
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
