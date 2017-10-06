import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-select-date-dialog',
  templateUrl: './select-date-dialog.component.html',
  styleUrls: ['./select-date-dialog.component.scss']
})
export class SelectDateDialogComponent implements OnInit {

  public selectedIndex;
  public itineraries;
  public participants;
  public mode;
  public userType;

  constructor(public dialogRef: MdDialogRef<SelectDateDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.itineraries = data.itineraries;
    this.mode = data.mode;
    this.participants = data.participants;
    this.userType = data.userType;

    this.itineraries.forEach(itinerary => {
      let thisParticipantCount = 0;
      this.participants.forEach(participant => {
        if (participant.calendarId === itinerary.calendar.id) {
          thisParticipantCount ++;
        }
      });
      itinerary['participantCount'] = thisParticipantCount;
    });
  }

  ngOnInit() {
    console.log(this.data);
  }

  onTabOpen(event) {
    this.selectedIndex = event.index;
  }

  onTabClose(event) {
    this.selectedIndex = -1;
  }

}
