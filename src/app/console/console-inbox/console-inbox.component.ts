import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsoleComponent } from '../console.component';
import { InboxService } from '../../_services/inbox/inbox.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';

import * as moment from 'moment';

@Component({
  selector: 'app-console-inbox',
  templateUrl: './console-inbox.component.html',
  styleUrls: ['./console-inbox.component.scss']
})
export class ConsoleInboxComponent implements OnInit {
  public loadingMessages = false;
  public joinedRooms = [];
  public defaultLoadedChat;
  public userId;
  private key = 'userId';
  public displayNone = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleComponent: ConsoleComponent,
    public _inboxService: InboxService,
    private _cookieUtilsService: CookieUtilsService
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
    this.userId = this._cookieUtilsService.getValue(this.key);
  }

  ngOnInit() {
    this._inboxService.getRoomData()
      .subscribe((response) => {
        console.log(response);
        this.joinedRooms = response;

        this.joinedRooms.sort((a, b) => {
          return moment(b.createdAt).diff(moment(a.createdAt), 'days');
        });
        console.log(this.joinedRooms);
        if (this.joinedRooms) {
          let room = this.joinedRooms[0];
          room = this.formatDateTime(room);
          this.displayNone.push[room.id] = false;
          this.defaultLoadedChat = room;
        }
      });
  }

  public openChat(room) {
    room = this.formatDateTime(room);
    this.defaultLoadedChat = room;
    this.displayNone.push[room.id] = false;
  }

  private formatDateTime(room) {
    if (room.messages) {
      room.messages[0].createdAtLocal = moment(room.messages[0].createdAt).format('ddd, MMM D YYYY');
    }
    return room;
  }

  public postMsg(roomId) {
    const body = {
      'text' : 'Hi Test',
      'type' : 'user'
    };
    this._inboxService.postMessage(roomId, body)
      .subscribe((response) => {
        console.log('Posted');
      });
  }

  public imgErrorHandler(event) {
    event.target.src = '/assets/images/placeholder-image.jpg';
  }

}
