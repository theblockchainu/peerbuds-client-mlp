import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AppConfig } from '../../app.config';
import { MdDialog } from '@angular/material';
import { SelectTopicsComponent } from '../dialogs/select-topics/select-topics.component';
import { SelectPriceComponent } from '../dialogs/select-price/select-price.component';
@Component({
  selector: 'app-peers',
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {
  public peers: Array<any>;
  public availableTopics: Array<any>;
  public userId;
  public loading = false;

  @ViewChild('topicButton') topicButton;
  @ViewChild('priceButton') priceButton;
  constructor(
    public _collectionService: CollectionService,
    public _profileService: ProfileService,
    private _cookieUtilsService: CookieUtilsService,
    public config: AppConfig,
    public dialog: MdDialog
  ) {
    
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.fetchPeers();
  }

  fetchPeers() {
    const query = {
      'include': [
        'reviewsAboutYou',
        'profiles'
      ],
      'limit': 50
    };
    this.loading = true;
    this._profileService.getAllPeers(query).subscribe((result) => {
      this.loading = false;
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
