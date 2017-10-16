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
  public filteredItineraries = [];

  constructor(public dialogRef: MdDialogRef<SelectDateDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.itineraries = data.itineraries;
    this.mode = data.mode;
    this.participants = data.participants;
    this.userType = data.userType;
    const today = moment();
    this.itineraries.forEach(itinerary => {
      let thisParticipantCount = 0;
      this.participants.forEach(participant => {
        if (participant.calendarId === itinerary.calendar.id) {
          thisParticipantCount ++;
        }
      });
      itinerary['participantCount'] = thisParticipantCount;
      console.log(moment(itinerary.calendar.startDate).diff(today, 'days'));
      if (moment(itinerary.calendar.startDate).diff(today, 'days') > 0 || this.userType === 'teacher') {
        this.filteredItineraries.push(itinerary);
      }
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
