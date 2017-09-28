import { Component, OnInit } from '@angular/core';
import {AppConfig} from '../../../app.config';
import {NotificationService} from '../../../_services/notification/notification.service';
declare var moment: any;
@Component({
  selector: 'app-app-notification-dialog',
  templateUrl: './app-notification-dialog.component.html',
  styleUrls: ['./app-notification-dialog.component.css']
})
export class AppNotificationDialogComponent implements OnInit {

  public picture_url = false;
  public notifications = [];
  public loaded = false;

  constructor(
      public config: AppConfig,
      public _notificationService: NotificationService) {
  }

  ngOnInit() {

    this.loaded = false;
    this._notificationService.getNotifications('{"include": [{"actor":"profiles"}, "collection"] }', (err, result) => {
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
      const replacements = {'%username%': '<b>' + notification.actor[0].profiles[0].first_name + ' ' + notification.actor[0].profiles[0].last_name + '</b>', '%collectionTitle%': notification.collection[0].title},
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
    this._notificationService.updateNotification(notification, (err, patchResult) => {
        if (err) {
            console.log(err);
            notification.hidden = false;
        }
    });
  }

}
