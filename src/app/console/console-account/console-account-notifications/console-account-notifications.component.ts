import { Component, OnInit } from '@angular/core';
import { ConsoleAccountComponent } from '../console-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { NotificationService } from '../../../_services/notification/notification.service';
import { UcWordsPipe } from 'ngx-pipes/esm';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';

declare var moment: any;

@Component({
    selector: 'app-console-account-notifications',
    templateUrl: './console-account-notifications.component.html',
    styleUrls: ['./console-account-notifications.component.scss'],
    providers: [UcWordsPipe]
})
export class ConsoleAccountNotificationsComponent implements OnInit {

    public picture_url = false;
    public notifications = [];
    public loaded = false;
    private userId;

    constructor(
        public activatedRoute: ActivatedRoute,
        public consoleAccountComponent: ConsoleAccountComponent,
        private config: AppConfig,
        public _notificationService: NotificationService,
        private ucwords: UcWordsPipe,
        public router: Router,
        private _cookieUtilsService: CookieUtilsService
    ) {
        activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
            if (urlSegment[0] === undefined) {
                consoleAccountComponent.setActiveTab('notifications');
            } else {
                consoleAccountComponent.setActiveTab(urlSegment[0].path);
            }
        });

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
        const replacements = {
            '%username%': '<b>' + this.ucwords.transform(notification.actor[0].profiles[0].first_name) + ' ' + this.ucwords.transform(notification.actor[0].profiles[0].last_name) + '</b>',
            '%collectionTitle%': notification.collection !== undefined ? this.ucwords.transform(notification.collection[0].title) : '***',
            '%collectionName%': notification.collection !== undefined ? '<b>' + this.ucwords.transform(notification.collection[0].title) + '</b>' : '***',
            '%collectionType%': notification.collection !== undefined ? this.ucwords.transform(notification.collection[0].type) : '***'
        },
            str = notification.description;

        return str.replace(/%\w+%/g, function (all) {
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

    public onNotificationClick(notification) {
        this.router.navigate(notification.actionUrl);
    }

}
