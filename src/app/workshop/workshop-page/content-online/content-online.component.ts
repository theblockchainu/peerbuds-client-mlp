import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import * as moment from 'moment';

@Component({
  selector: 'app-content-online',
  templateUrl: './content-online.component.html',
  styleUrls: ['./content-online.component.scss']
})
export class ContentOnlineComponent implements OnInit {

  constructor(public config: AppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

}
