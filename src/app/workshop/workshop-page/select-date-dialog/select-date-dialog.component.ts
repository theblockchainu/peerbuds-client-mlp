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

  constructor(public dialogRef: MdDialogRef<SelectDateDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onTabOpen(event) {
    this.selectedIndex = event.index;
  }

}
