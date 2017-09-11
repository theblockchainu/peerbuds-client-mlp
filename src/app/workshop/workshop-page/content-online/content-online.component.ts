import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import * as moment from 'moment';
import {CollectionService} from '../../../_services/collection/collection.service';

@Component({
  selector: 'app-content-online',
  templateUrl: './content-online.component.html',
  styleUrls: ['./content-online.component.scss']
})
export class ContentOnlineComponent implements OnInit {

  constructor(public config: AppConfig,
    public _collectionService: CollectionService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  /**
   * joinSession
   */
  public joinSession() {
    console.log('Handle Online session here');
  }

}
