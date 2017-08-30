import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response, } from '@angular/http';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss']
})
export class SubmissionViewComponent implements OnInit {

  constructor( public config: AppConfig,
     @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

}
