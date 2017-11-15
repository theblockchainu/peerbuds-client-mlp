import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CollectionService } from '../../collection/collection.service';
import { AppConfig } from '../../../app.config';
@Component({
  selector: 'app-profile-popup-card',
  templateUrl: './profile-popup-card.component.html',
  styleUrls: ['./profile-popup-card.component.scss']
})
export class ProfilePopupCardComponent implements OnInit {

  public userRating: any;
  public ownedCollections = [];
  constructor(public dialogRef: MdDialogRef<ProfilePopupCardComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public _collectionService: CollectionService,
    public _config: AppConfig) { }

  ngOnInit() {
    console.log(this.data);
    this.userRating = this._collectionService.calculateRating(this.data.reviewsAboutYou);
    this.ownedCollections = this.data.ownedCollections.filter((collection) =>
      collection.status === 'active' || collection.status === 'completed');
  }
}

