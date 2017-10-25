import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { NotificationService } from '../../../_services/notification/notification.service';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { UcWordsPipe } from 'ngx-pipes/esm';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';
declare var moment: any;
@Component({
  selector: 'app-app-notification-dialog',
  templateUrl: './app-notification-dialog.component.html',
  styleUrls: ['./app-notification-dialog.component.css'],
    providers: [UcWordsPipe]
})
export class AppNotificationDialogComponent implements OnInit {

  public picture_url = false;
  public notifications = [];
  public loaded = false;
  private userId;

  constructor(
      public config: AppConfig,
      public _notificationService: NotificationService,
      public router: Router,
      private ucwords: UcWordsPipe,
      public dialogRef: MdDialogRef<AppNotificationDialogComponent>,
      public _cookieUtilsService: CookieUtilsService
  ) {
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.loaded = false;
    this._notificationService.getNotifications(this.userId, '{"include": [{"actor":"profiles"}, "collection"], "order": "createdAt DESC" }', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(resultItem => {
              if (resultItem.actor[0] !== undefined) {
                this.notifications.push(resultItem);
              }
            });
            this.loaded = true;
        }
    });
  }

  public getNotificationText(notification) {
      const replacements = {'%username%': '<b>' + this.ucwords.transform(notification.actor[0].profiles[0].first_name) + ' ' + this.ucwords.transform(notification.actor[0].profiles[0].last_name) + '</b>', '%collectionTitle%': this.ucwords.transform(notification.collection[0].title), '%collectionName%': '<b>' + this.ucwords.transform(notification.collection[0].title) + '</b>', '%collectionType%': this.ucwords.transform(notification.collection[0].type)},
          str = notification.description;

      return str.replace(/%\w+%/g, function(all) {
          return replacements[all] || all;
      });
  }

  public getNotificationTime(notification) {
    const createdAt = moment(notification.createdAt);
    return createdAt.fromNow();
  }

  public hideNotification(notification) {
    notification.hidden = true;
    this._notificationService.updateNotification(this.userId, notification, (err, patchResult) => {
        if (err) {
            console.log(err);
            notification.hidden = false;
        }
    });
  }

  public openViewAll() {
      this.router.navigate(['console', 'account', 'notifications']);
      this.dialogRef.close();
  }

  public onNotificationClick(notification) {
      this.dialogRef.close();
      this.router.navigate(notification.actionUrl);
  }

}
