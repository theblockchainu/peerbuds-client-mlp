import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, Route } from '@angular/router';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog, MdSnackBar } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { CollectionService } from '../../../_services/collection/collection.service';
import { ProfileService } from '../../../_services/profile/profile.service';
@Component({
  selector: 'app-rate-participants',
  templateUrl: './rate-participant-dialog.component.html',
  styleUrls: ['./rate-participant-dialog.component.scss']
})
export class RateParticipantComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<RateParticipantComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public config: AppConfig,
    private dialog: MdDialog,
    public _collectionService: CollectionService,
    public snackBar: MdSnackBar,
    public _profileService: ProfileService,
    public _fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.data) {
      this.data.participants.forEach(participant => {
        participant['description'] = '';
        participant['score'] = 0;
        participant['hasReviewForPresentCollection'] = false;
        participant['reviewsAboutYou'].forEach(reviews => {
          if (reviews.collectionId === this.data.id) {
            participant['hasReviewForPresentCollection'] = true;
          }
        });
      });
    }
  }

  saveReviews() {
    console.log(this.data.participants);
    const reviewBody = [];
    const collectionId = this.data.id;
    const collectionCalendarId = this.data.calendars[0].id;

    this.data.participants.forEach(participant => {
      reviewBody.push({
        'description': participant.description,
        'score': participant.score,
        'collectionId': collectionId,
        'collectionCalendarId': collectionCalendarId //TBD pick the right calendar id
      });
      this._collectionService.postReview(participant.id, reviewBody).subscribe(
        result => {
        }, err => {
          console.log(err);
        }
      );
    });
    this.dialogRef.close();
  }

}
