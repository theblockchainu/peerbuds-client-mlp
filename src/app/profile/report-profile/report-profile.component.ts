import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-report-profile',
  templateUrl: './report-profile.component.html',
  styleUrls: ['./report-profile.component.scss']
})
export class ReportProfileComponent implements OnInit {

  public reason: string;

  constructor(
    public dialogRef: MdDialogRef<ReportProfileComponent>,
  ) { }


  ngOnInit() {
  }

}
