import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
// import { MessageParticipantComponent } from '../message-participant/message-participant.component';
import { CollectionService } from '../../../_services/collection/collection.service';
@Component({
  selector: 'app-view-room-participants',
  templateUrl: './view-room-participants-dialog.component.html',
  styleUrls: ['./view-room-participants-dialog.component.scss']
})
export class ViewRoomParticipantsDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ViewRoomParticipantsDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public config: AppConfig,
    private dialog: MdDialog,
    private _collectionService: CollectionService
  ) { }

  ngOnInit() {
  }


  /**
   * messageParticipant
   */
  public messageParticipant(participant: any) {
    console.log(participant);
    // const dialogRef = this.dialog.open(MessageParticipantComponent, {
    //   data: participant,
    //   width: '600px'
    // });
  }


}
