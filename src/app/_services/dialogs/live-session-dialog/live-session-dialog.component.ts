import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import * as Video from 'twilio-video';
import * as _ from 'lodash';
import { TwilioServicesService } from '../../twlio_services/twilio-services.service';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CookieUtilsService } from '../../cookieUtils/cookie-utils.service';
import { SocketService } from '../../socket/socket.service';
import { Router } from '@angular/router';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-live-session-dialog',
  templateUrl: './live-session-dialog.component.html',
  styleUrls: ['./live-session-dialog.component.scss']
})
export class LiveSessionDialogComponent implements OnInit, OnDestroy {
  private token: string;
  private roomName: string;
  private localTracks;
  public room: any;
  public mainLoading: boolean;
  public startedView;
  public userId;
  public isTeacher = false;
  private participantCount: number;
  public registeredParticipantMapObj: any;
  public joinedParticipantArray: Array<any>;
  public localAudioTrack: any;
  public localVideoTrack: any;

  @ViewChild('mainStream') mainStream: ElementRef;
  @ViewChild('otherStream') otherStream: ElementRef;
  @ViewChild('localStream') localStream: ElementRef;
  @ViewChild('otherStreamTeacher') otherStreamTeacher: ElementRef;

  constructor(
    private _twilioServicesService: TwilioServicesService,
    public dialogRef: MdDialogRef<LiveSessionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private renderer: Renderer2,
    private cookieUtilsService: CookieUtilsService,
    private _socketService: SocketService,
    private router: Router,
    private deviceService: Ng2DeviceService
  ) {
    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.participantCount = 0;
    this.registeredParticipantMapObj = {};
    this.dialogData.participants.forEach(participant => {
      this.registeredParticipantMapObj[participant.id] = participant;
    });
    this.mainLoading = true;
    this._twilioServicesService.getToken().subscribe(
      result => {
        this.token = result.token;
        this.createRoom();
      }
    );
    this.roomName = this.dialogData.roomName;
    this.dialogRef.afterClosed().subscribe(result => {
      this.room.disconnect();
    });
    this.recordSessionStart();
  }

  ngOnDestroy() {
    this.recordSessionEnd();
  }

  private createRoom() {
    this.joinedParticipantArray = [];
    Video.connect(this.token, {
      name: this.roomName,
      audio: { name: 'microphone' },
      video: {
        width: 1280,
        name: 'camera'
      }
    }).then((createdRoom) => {
      this.room = createdRoom;
      console.log('Connected to Room "%s"', this.room.name);

      const localParticipant = this.room.localParticipant;
      const localDiv = this.renderer.createElement('div');
      localDiv.id = localParticipant.identity;

      localParticipant.tracks.forEach(track => {
        if (track.kind === 'audio') {
          this.localAudioTrack = track;
          this.localAudioTrack.on('disabled', (audtrack) => {
            console.log('disabled');
          });
          this.localAudioTrack.on('enabled', (audtrack) => {
            console.log('enabled');
          });

        } else if (track.kind === 'video') {
          this.localVideoTrack = track;
          this.localVideoTrack.on('disabled', (audtrack) => {
            console.log('disabled');
          });
          this.localVideoTrack.on('enabled', (audtrack) => {
            console.log('enabled');
          });
        }
        this.trackAdded(localDiv, track);

        if (localParticipant.identity === this.dialogData.teacherId) {
          this.isTeacher = true;
          this.mainLoading = false;
          this.renderer.appendChild(this.mainStream.nativeElement, localDiv);
        } else {
          this.renderer.appendChild(this.localStream.nativeElement, localDiv);
        }
      });

      this.room.participants.forEach(participant => this.participantConnected(participant));
      this.room.on('participantConnected', participant => this.participantConnected(participant));

      this.room.on('participantDisconnected', participant => this.participantDisconnected(participant));
      this.room.once('disconnected', error => this.room.participants.forEach(participant => this.participantDisconnected(participant)));


    }, (error) => {
      console.error('Unable to connect to Room: ' + error.message);
    });
  }

  private participantConnected(participant: any) {
    console.log('Already in Room: ' + participant.identity);
    const div = this.renderer.createElement('div');
    div.id = participant.identity;
    // div.innerText = participant.identity;
    if (participant.identity === this.dialogData.teacherId) {
      this.mainLoading = false;
      participant.on('trackAdded', track => this.trackAdded(div, track));
      participant.tracks.forEach(track => this.trackAdded(div, track));
      participant.on('trackRemoved', track => this.trackRemoved(track));
      this.renderer.appendChild(this.mainStream.nativeElement, div);
    } else {
      this.joinedParticipantArray.push(participant);
      this.participantCount++;
      if (this.isTeacher) {
        if (this.participantCount < 6) {
          participant.on('trackAdded', track => this.trackAdded(div, track));
          participant.tracks.forEach(track => this.trackAdded(div, track));
          participant.on('trackRemoved', track => this.trackRemoved(track));
          this.renderer.appendChild(this.otherStreamTeacher.nativeElement, div);
          console.log('added');
        }
      } else {
        if (this.participantCount < 5) {
          participant.on('trackAdded', track => this.trackAdded(div, track));
          participant.tracks.forEach(track => this.trackAdded(div, track));
          participant.on('trackRemoved', track => this.trackRemoved(track));
          this.renderer.appendChild(this.otherStream.nativeElement, div);
          console.log('added');
        }
      }

    }
  }

  private participantDisconnected(participant: any) {
    console.log('Participant "%s" disconnected', participant.identity);
    // participant.tracks.forEach(this.trackRemoved);
    // document.getElementById(participant.sid).remove();
    const elem: Element = document.getElementById(participant.identity);
    console.log(elem);
  }

  private trackAdded(div, track) {
    div.appendChild(track.attach());
  }

  private trackRemoved(track) {
    // track.detach().forEach(element => element.remove());
    // console.log(track.detach());
  }

  private recordSessionStart() {
    const view = {
      type: 'user',
      url: this.router.url,
      ip_address: '',
      browser: this.deviceService.getDeviceInfo().browser,
      viewedModelName: 'content',
      startTime: new Date(),
      content: this.dialogData.content,
      viewer: {
        id: this.userId
      }
    };
    this._socketService.sendStartView(view);
    this._socketService.listenForViewStarted().subscribe(startedView => {
      this.startedView = startedView;
      console.log(startedView);
    });
  }

  private recordSessionEnd() {
    this.startedView.viewer = {
      id: this.userId
    };
    this.startedView.endTime = new Date();
    this._socketService.sendEndView(this.startedView);
    this._socketService.listenForViewEnded().subscribe(endedView => {
      delete this.startedView;
      console.log(endedView);
    });
  }

  /**
   * toggleVideo
   */
  public toggleVideo() {
    if (this.localVideoTrack.isEnabled) {
      this.localVideoTrack.disable();
    } else {
      this.localVideoTrack.enable();
    }
  }

  /**
   * toggleAudio
   */
  public toggleAudio() {
    if (this.localAudioTrack.isEnabled) {
      this.localAudioTrack.disable();
    } else {
      this.localAudioTrack.enable();
    }
  }

}
