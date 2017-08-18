import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { MessageParticipantComponent } from '../message-participant/message-participant.component';
@Component({
  selector: 'app-view-participants',
  templateUrl: './view-participants.component.html',
  styleUrls: ['./view-participants.component.scss']
})
export class ViewParticipantsComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ViewParticipantsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private config: AppConfig,
    private dialog: MdDialog
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

  // /**
  // * removeParticipant
  // */
  // public removeParticipant(participantId: string) {
  //   this._collectionService.removeParticipant(this.workshopId, participantId).subscribe((response) => {
  //     console.log('deleted');
  //     this.initializeWorkshop();
  //   });
  // }


}
