import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';

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
    public config: AppConfig
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
        'reviews'
      ],
      'limit': 5
    };
    this._collectionService.getRecommendations(query, (err, response: any) => {
      if (err) {
        console.log(err);
      } else {
        this.workshops = [];
        for (const responseObj of response) {
          responseObj.rating = this._collectionService.calculateRating(responseObj.reviews);
          this.workshops.push(responseObj);
        }
      }
    });
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
        responseObj.rating = this._collectionService.calculateRating(responseObj.reviewsAboutYou);
        this.peers.push(responseObj);
      }
    }, (err) => {
      console.log(err);
    });
  }


}
