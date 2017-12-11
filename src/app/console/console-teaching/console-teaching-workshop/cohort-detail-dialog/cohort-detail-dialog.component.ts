import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CollectionService } from '../../../../_services/collection/collection.service';

@Component({
  selector: 'app-cohort-detail-dialog',
  templateUrl: './cohort-detail-dialog.component.html',
  styleUrls: ['./cohort-detail-dialog.component.css']
})
export class CohortDetailDialogComponent implements OnInit {

  public cohortsDataArray: Array<any>;

  constructor(
    public dialogRef: MdDialogRef<CohortDetailDialogComponent>,
    public _collectionService: CollectionService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    const calendarIds = [];
    const cohortsDataObj = {};
    this.data.calendars.forEach(calendar => {
        if (calendar.status === this.data.status) {
            calendarIds.push(calendar.id);
            calendar['participants'] = [];
            cohortsDataObj[calendar.id] = calendar;
        }
    });
    console.log(calendarIds);
    const query = { 'relInclude': 'calendarId' };
    this._collectionService.getParticipants(this.data.id, query).subscribe(
      result => {
        const participants = result.json();
        participants.forEach(particpant => {
          if (particpant.calendarId in cohortsDataObj) {
            cohortsDataObj[particpant.calendarId]['participants'].push(particpant);
          }
        });
        this.cohortsDataArray = [];
        for (const key in cohortsDataObj) {
          if (cohortsDataObj.hasOwnProperty(key)) {
            this.cohortsDataArray.push(cohortsDataObj[key]);
          }
        }

        this.cohortsDataArray
          .sort((a, b) => {
            if (a.startDate < b.startDate) {
              return -1;
            }
            if (a.startDate > b.startDate) {
              return 1;
            }
            return 0;
          });
        console.log(this.cohortsDataArray);

      }, err => {
        console.log(err);
      }
    );
  }

}
