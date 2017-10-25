import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import * as Video from 'twilio-video';

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

  @ViewChild('mainStream') mainStream: ElementRef;
  @ViewChild('localStream') localStream: ElementRef;

  constructor(
    private _twilioServicesService: TwilioServicesService,
    public dialogRef: MdDialogRef<LiveSessionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit() {

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
      video: {
        width: 800
      }
    }).then((createdRoom) => {
      this.room = createdRoom;
      // this.createTrack();
      const localParticipant = this.room.localParticipant;
      localParticipant.tracks.forEach(track => {
        if (localParticipant.identity === this.dialogData.teacherId) {
          this.mainStream.nativeElement.appendChild(track.attach());
          this.mainLoading = false;
        } else {
          this.localStream.nativeElement.appendChild(track.attach());
        }
      });

      // Log any Participants already connected to the Room
      this.room.participants.forEach(participant => {
        console.log('Participant "%s" is connected to the Room', participant.identity);
        if (participant.identity === this.dialogData.teacherId) {
          const participants = <Map<any, any>>participant;
          console.log(participants);
          participant.tracks.forEach(track => {
            this.mainStream.nativeElement.appendChild(track.attach());
            this.mainLoading = false;
          });
        }
      });

      // Log new Participants as they connect to the Room
      this.room.once('participantConnected', participant => {
        console.log('Participant "%s" has connected to the Room', participant.identity);
        participant.tracks.forEach(track => {
          this.mainStream.nativeElement.appendChild(track.attach());
        });
      });

      // Log Participants as they disconnect from the Room
      this.room.once('participantDisconnected', participant => {
        console.log('Participant "%s" has disconnected from Room', participant.identity);
      });

    }, function (error) {
      console.error('Unable to connect to Room: ' + error.message);
    });
  }

}
