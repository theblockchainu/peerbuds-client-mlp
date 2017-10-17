import { Component, OnInit } from '@angular/core';
import { TwilioServicesService } from '../../twlio_services/twilio-services.service';
import * as Video from 'twilio-video';


@Component({
  selector: 'app-live-video-dialog',
  templateUrl: './live-video-dialog.component.html',
  styleUrls: ['./live-video-dialog.component.scss']
})
export class LiveVideoDialogComponent implements OnInit {
  public activeRoom;
  public previewTracks;
  public identity;
  public roomName;
  private data: any;

  constructor(private _twilioServicesService: TwilioServicesService) { }

  ngOnInit() {

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener('beforeunload', this.leaveRoomIfJoined);

    this._twilioServicesService.getToken().subscribe(
      result => {
        this.data = result;
        document.getElementById('room-controls').style.display = 'block';
        // Bind button to leave Room.
      }
    );

  }

  // Attach the Tracks to the DOM.
  public attachTracks(tracks, container) {
    tracks.forEach(function (track) {
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  public attachParticipantTracks(participant, container) {
    const tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  // Detach the Tracks from the DOM.
  public detachTracks(tracks) {
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
  }

  // Detach the Participant's Tracks from the DOM.
  public detachParticipantTracks(participant) {
    const tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }


  public joinRoom() {
    this.roomName = document.getElementById('room-name')['value'];
    if (!this.roomName) {
      alert('Please enter a room name.');
      return;
    }

    console.log('Joining room ' + this.roomName + '...');
    const connectOptions = {
      name: this.roomName,
      logLevel: 'debug'
    };

    if (this.previewTracks) {
      connectOptions['tracks'] = this.previewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(this.data.token, connectOptions).then(this.roomJoined, function (error) {
      console.log('Could not connect to Twilio: ' + error.message);
    });
  }

  public leaveRoom() {
    console.log('Leaving room...');
    this.activeRoom.disconnect();
  }

  public preview() {
    const localTracksPromise = this.previewTracks
      ? Promise.resolve(this.previewTracks)
      : Video.createLocalTracks();

    localTracksPromise.then((tracks) => {
      window['previewTracks'] = this.previewTracks = tracks;
      const previewContainer = document.getElementById('local-media');
      if (!previewContainer.querySelector('video')) {
        this.attachTracks(tracks, previewContainer);
      }
    }, function (error) {
      console.error('Unable to access local media', error);
      console.log('Unable to access Camera and Microphone');
    });
  }

  // Successfully connected!
  public roomJoined(room) {
    window['room'] = this.activeRoom = room;

    console.log('Joined as ' + this.identity + '');
    document.getElementById('button-join').style.display = 'none';
    document.getElementById('button-leave').style.display = 'inline';

    // Attach LocalParticipant's Tracks, if not already attached.
    const previewContainer = document.getElementById('local-media');
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach(function (participant) {
      console.log('Already in Room: ' + participant.identity + '');
      const prevContainer = document.getElementById('remote-media');
      this.attachParticipantTracks(participant, prevContainer);
    });

    // When a Participant joins the Room, console.log the event.
    room.on('participantConnected', function (participant) {
      console.log('Joining: ' + participant.identity);
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', function (track, participant) {
      console.log(participant.identity + ' added track: ' + track.kind);
      const prevContainer = document.getElementById('remote-media');
      this.attachTracks([track], prevContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', function (track, participant) {
      console.log(participant.identity + ' removed track: ' + track.kind);
      this.detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', function (participant) {
      console.log('Participant ' + participant.identity + ' left the room');
      this.detachParticipantTracks(participant);
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', function () {
      console.log('Left');
      if (this.previewTracks) {
        this.previewTracks.forEach(function (track) {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.activeRoom = null;
      document.getElementById('button-join').style.display = 'inline';
      document.getElementById('button-leave').style.display = 'none';
    });
  }
  // Activity log.
  public log(message) {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // Leave Room.
  public leaveRoomIfJoined() {
    if (this.activeRoom) {
      this.activeRoom.disconnect();
    }
  }


}

