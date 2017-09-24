import { Component, OnInit } from '@angular/core';
import {AppConfig} from '../../../app.config';

@Component({
  selector: 'app-app-notification-dialog',
  templateUrl: './app-notification-dialog.component.html',
  styleUrls: ['./app-notification-dialog.component.css']
})
export class AppNotificationDialogComponent implements OnInit {

  public picture_url = false;

  constructor(
      public config: AppConfig
  ) {
  }

  ngOnInit() {
  }

}
