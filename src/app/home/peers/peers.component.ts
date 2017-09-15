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
  public userId: string;

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
  // openTopicsDialog(): void {
  //   const dialogRef = this.dialog.open(SelectTopicsComponent, {
  //     width: '250px',
  //     data: this.availableTopics,
  //     disableClose: true,
  //     position: {
  //       top: this.topicButton._elementRef.nativeElement.getBoundingClientRect().top + 'px',
  //       left: this.topicButton._elementRef.nativeElement.getBoundingClientRect().left + 'px'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.availableTopics = result;
  //       this.fetchPeers();
  //     }
  //   });
  // }

  // openPriceDialog(): void {
  //   const dialogRef = this.dialog.open(SelectPriceComponent, {
  //     width: '250px',
  //     data: {
  //       availableRange: this.availableRange,
  //       selectedRange: this.selectedRange
  //     },
  //     disableClose: true,
  //     position: {
  //       top: this.priceButton._elementRef.nativeElement.getBoundingClientRect().top + 'px',
  //       left: this.priceButton._elementRef.nativeElement.getBoundingClientRect().left + 'px'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.selectedRange = result.selectedRange;
  //       this.fetchWorkshops();
  //     }
  //   });
  // }
}
