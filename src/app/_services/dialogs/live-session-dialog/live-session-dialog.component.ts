import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as Video from 'twilio-video';
import * as _ from 'lodash';
import { TwilioServicesService } from '../../twlio_services/twilio-services.service';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-live-session-dialog',
  templateUrl: './live-session-dialog.component.html',
  styleUrls: ['./live-session-dialog.component.scss']
})
export class LiveSessionDialogComponent implements OnInit {
  private token: string;
  private roomName: string;
  private localTracks;
  public room: any;
  public mainLoading: boolean;

  private participantCount: number;

  @ViewChild('mainStream') mainStream: ElementRef;
  @ViewChild('otherStream') otherStream: ElementRef;
  @ViewChild('localStream') localStream: ElementRef;

  constructor(
    private _twilioServicesService: TwilioServicesService,
    public dialogRef: MdDialogRef<LiveSessionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.participantCount = 0;

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
  }

  private createRoom() {
    Video.connect(this.token, {
      name: this.roomName,
      audio: true,
      video: {
        width: 1280
      }
    }).then((createdRoom) => {
      this.room = createdRoom;
      const localParticipant = this.room.localParticipant;

      localParticipant.tracks.forEach(track => {
        if (localParticipant.identity === this.dialogData.teacherId) {
          this.renderer.appendChild(this.mainStream.nativeElement, track.attach());
          this.mainLoading = false;
        } else {
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

}
