import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog, MdSnackBar } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { MessageParticipantComponent } from '../message-participant/message-participant.component';
import { CollectionService } from '../../../_services/collection/collection.service';
import { DialogsService } from '../../../_services/dialogs/dialog.service';
import { ProfileService } from '../../../_services/profile/profile.service';
@Component({
  selector: 'app-view-participants',
  templateUrl: './view-participants.component.html',
  styleUrls: ['./view-participants.component.scss']
})
export class ViewParticipantsComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ViewParticipantsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public config: AppConfig,
    private dialog: MdDialog,
    private _collectionService: CollectionService,
    public _dialogsService: DialogsService,
    public snackBar: MdSnackBar,
    public _profileService: ProfileService
  ) { }

  ngOnInit() {
  }


  /**
   * messageParticipant
   */
  public messageParticipant(participant: any) {
    console.log(participant);
    const dialogRef = this.dialog.open(MessageParticipantComponent, {
      data: participant,
      width: '600px'
    });
  }

  /**
  * removeParticipant
  */
  public removeParticipant(participantId: string) {
    this._collectionService.removeParticipant(this.data.communityId, participantId).subscribe((response) => {
      location.reload();
      console.log('deleted');
    });
  }

  public reportProfile(participantId) {
    this._dialogsService.reportProfile().subscribe(result => {
      if (result) {
        console.log('report' + result);
        this._profileService.reportProfile(participantId, {
          'description': result,
          'is_active': true
        }).subscribe((respone) => {
          console.log(respone);
          this.snackBar.open('Profile Reported', 'Close');
        }, (err) => {
          this.snackBar.open('Profile Reported Failed', 'Retry').onAction().subscribe(() => {
            this.reportProfile(participantId);
          });
        });
      }
    });
  }


}
