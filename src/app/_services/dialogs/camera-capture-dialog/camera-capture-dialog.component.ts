import { ViewChild, ViewChildren, Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { InboxService } from '../../inbox/inbox.service';

@Component({
  selector: 'app-camera-capture-dialog',
  templateUrl: './camera-capture-dialog.component.html',
  styleUrls: ['./camera-capture-dialog.component.scss']
})
export class CameraCaptureDialogComponent implements OnInit {

  public action;
  public n = <any>navigator;
  public video;
  public canvas;
  public localStream;
  public img;
  public toggleDisplay = false;

  @ViewChild('hardwareVideo') hardwareVideo: any;

  constructor(
    public dialogRef: MdDialogRef<CameraCaptureDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public _inboxService: InboxService) { }

  ngOnInit() {
    this.video = this.hardwareVideo.nativeElement;
    let video = this.video;
    this.n.getUserMedia = ( this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia  || this.n.msGetUserMedia );

    this.n.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.src = window.URL.createObjectURL(stream);
      this.localStream = stream;
      this.video = video;
      this.video.play();
    })
    // permission denied:
    .catch(function(error) {
      document.body.textContent = 'Could not access the camera. Error: ' + error.name;
    });;
  }

  public closeDialog() {
    // this.video.src = '';
    // this.n.video = false;
    this.localStream.getVideoTracks()[0].stop();
    this.dialogRef.close();
  }

  // this.dialogRef.close(result);

  public takePhoto() {
    this.img = document.querySelector('img') || document.createElement('img');
    var context;
    var width = this.video.offsetWidth
      , height = this.video.offsetHeight;

    this.canvas = this.canvas || document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, width, height);

    this.img.src = this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream"); ;
    document.getElementById('capturedPhoto').appendChild(this.img);
    document.getElementById('videoStream').style.display = 'none';
    this.toggleDisplay = !this.toggleDisplay;
  }

  public sendPhoto() {
      const body = {
        'text' : this.img.src,
        'type' : 'user'
      };
      this._inboxService.postMessage(this.data.room, body)
        .subscribe((response) => {
          console.log('Posted Attachment');
          this.closeDialog();
        });
  }

}
