import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { ProfileService } from '../_services/profile/profile.service';
import { FormControl } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Http } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { DialogsService } from '../_services/dialogs/dialog.service';
import {AppNotificationDialogComponent} from './dialogs/app-notification-dialog/app-notification-dialog.component';
import {NotificationService} from '../_services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppHeaderComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  loggedIn: boolean;
  public hasNewNotification = false;
  public profile: any = {};
  public userType = '';
  public myControl = new FormControl('');
    @ViewChild('notificationsButton') notificationsButton;
  public userId: string;
  public userIdObservable;
  private key = 'userId';
  public options: any[];
  public defaultProfileUrl = '/assets/images/default-user.jpg';
  public isTeacher = false;
  public makeOldNotification = [];

  constructor(public authService: AuthenticationService,
              public requestHeaderService: RequestHeaderService,
              public config: AppConfig,
              private http: Http,
              private _cookieService: CookieService,
              private _profileService: ProfileService,
              private router: Router,
              private dialog: MdDialog,
              private _notificationService: NotificationService,
              private dialogsService: DialogsService) {
                this.isLoggedIn = authService.isLoggedIn();
                authService.isLoggedIn().subscribe((res) => {
                  this.loggedIn = res;
                });

                authService.getLoggedInUser.subscribe((userId) => {
                  if(userId !== 0) {
                    this.userId = userId;
                    this.getProfile();
                  }
                  else {
                    this.loggedIn = false;
                  }
                });

                this.userId = this.userIdObservable || this.getCookieValue(this.key);

          }

  ngOnInit() {
    this.getProfile();
    this.getNotifications();
    this.myControl.valueChanges.subscribe((value) => {
      this.getAllSearchResults(value, (err, result) => {
        if (!err) {
          this.options = result;
        } else {
          console.log(err);
        }
      });
    });
  }

  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  getProfile() {
    if (this.loggedIn) {
        this._profileService.getCompactProfile(this.userId).subscribe(profile => {
            this.profile = profile[0];
            if (this.profile.peer[0].ownedCollections !== undefined && this.profile.peer[0].ownedCollections.length > 0) {
                this.isTeacher = true;
            }
        });
    }
    else {
      return null;
    }
  }

  public getAllSearchResults(query: any, cb) {
    if (this.userId) {
      this.http
        .get(this.config.searchUrl + '/searchAll?' + 'query=' + query)
        .map((response) => {
          console.log(response.json());
          cb(null, response.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public getSearchOptionText(option) {
    switch (option.index) {
      case 'collection':
        switch (option.data.type) {
          case 'workshop':
            return option.data.title;
          case 'experience':
            return option.data.title;
          default:
            return option.data.title;
        }
      case 'topic':
        return option.data.name;
      case 'peer':
        if (option.data.profiles[0] !== undefined && option.data.profiles[0].first_name === undefined) {
          return option.data.id;
        } else {
          return option.data.profiles[0].first_name + ' ' + option.data.profiles[0].last_name;
        }
      default:
        return;
    }
  }

  public getSearchOptionType(option) {
    switch (option.index) {
      case 'collection':
        switch (option.data.type) {
          case 'workshop':
            return 'Workshop : ';
          case 'experience':
            return 'Experience : ';
          default:
            return 'Collection : ';
        }
      case 'topic':
        return 'Topic : ';
      case 'peer':
        return 'Peer : ';
      default:
        return;
    }
  }

  public onSearchOptionClicked(option) {
      switch (option.index) {
          case 'collection':
              switch (option.data.type) {
                  case 'workshop':
                      this.router.navigate(['/workshop', option.data.id]);
                      break;
                  case 'experience':
                      this.router.navigate(['/experience', option.data.id]);
                      break;
                  default:
                      this.router.navigate(['/console/dashboard']);
                      break;
              }
              break;
          case 'topic':
              this.router.navigate(['/console/profile/topics']);
              break;
          case 'peer':
              this.router.navigate(['/profile', option.data.id]);
              break;
          default:
              break;
      }
  }

  public openSignup() {
    this.dialogsService.openSignup().subscribe();
  }


   public openLogin() {
    this.dialogsService.openLogin().subscribe();
  }

  public goToHome() {
    if (this.loggedIn) {
      this.router.navigate(['home', 'homefeed']);
    }
    else {
      this.router.navigate(['/']);
    }
  }

  public getNotifications() {
      this._notificationService.getNotifications('{}', (err, result) => {
          if (err) {
              console.log(err);
          } else {
              result.forEach(resultItem => {
                  if (resultItem.new) {
                      this.hasNewNotification = true;
                      resultItem.new = false;
                      delete resultItem.seen;
                      delete resultItem.createdAt;
                      delete resultItem.updatedAt;
                      this.makeOldNotification.push(resultItem);
                  }
              });
          }
      });
  }

  openNotificationsDialog(): void {
      const dialogRef = this.dialog.open(AppNotificationDialogComponent, {
          width: '350px',
          data: {
          },
          disableClose: false,
          position: {
              top: this.notificationsButton._elementRef.nativeElement.getBoundingClientRect().bottom + 8 + 'px',
              left: this.notificationsButton._elementRef.nativeElement.getBoundingClientRect().left - 170 + 'px'
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (this.makeOldNotification.length > 0) {
              this.makeOldNotification.forEach(notifItem => {
                  this._notificationService.updateNotification(notifItem, (err, patchResult) => {
                      if (err) {
                          console.log(err);
                      }
                  });
              });
              this.hasNewNotification = false;
          }
      });
  }
}
