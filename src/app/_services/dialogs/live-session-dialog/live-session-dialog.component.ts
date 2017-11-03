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
      const localParticipant = this.room.localParticipant;
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
        if (localParticipant.identity === this.dialogData.teacherId) {
          this.isTeacher = true;
          this.renderer.appendChild(this.mainStream.nativeElement, track.attach());
          this.mainLoading = false;
        } else {
          console.log(track.attach());
          this.renderer.appendChild(this.localStream.nativeElement, track.attach());
        }
      });
      const otherParticipants = this.room.participants;
      // Log any Participants already connected to the Room
      otherParticipants.forEach(participant => {
        console.log('Already in Room: ' + participant.identity);
        if (participant.identity === this.dialogData.teacherId) {
          participant.on('trackAdded', (track, error) => {
            if (error) {
              console.log('Error in track:', error);
            } else {
              this.mainLoading = false;
              this.renderer.appendChild(this.mainStream.nativeElement, track.attach());
            }
          });
        } else {
          this.joinedParticipantArray.push(participant);
          this.participantCount++;
          if (this.participantCount < 5) {
            participant.on('trackAdded', (track, error) => {
              if (error) {
                console.log('Error in track:', error);
              } else {
                this.renderer.appendChild(this.otherStream.nativeElement, track.attach());
              }
            });
          }
        }
      });

      // Log new Participants as they connect to the Room
      this.room.once('participantConnected', participant => {
        console.log('Participant "%s" has connected to the Room', participant.identity);
        if (participant.identity === this.dialogData.teacherId) {
          participant.on('trackAdded', (track, error) => {
            if (error) {
              console.log('Error in track:', error);
            } else {
              this.mainLoading = false;
              this.renderer.appendChild(this.mainStream.nativeElement, track.attach());
            }
          });
        } else {
          this.participantCount++;
          if (this.participantCount < 5) {
            participant.on('trackAdded', (track, error) => {
              if (error) {
                console.log('Error in track:', error);
              } else {
                this.mainLoading = false;
                this.renderer.appendChild(this.otherStream.nativeElement, track.attach());
              }
            });
          }
        }
      });

      // Log Participants as they disconnect from the Room
      this.room.once('participantDisconnected', participant => {
        console.log('Participant has disconnected from Room', participant);
        participant.tracks.forEach(track => {
          track.detach();
        });
      });

    }, function (error) {
      console.error('Unable to connect to Room: ' + error.message);
    });
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
