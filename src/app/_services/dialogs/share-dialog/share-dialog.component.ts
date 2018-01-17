import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { AppConfig } from '../../../app.config';

declare var FB: any;


@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {

  public generatedUrl: string;
  public tweetUrl: string;
  public LinkedInShareUrl: string;
  constructor(public dialogRef: MdDialogRef<ShareDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
    public config: AppConfig) {
    if (data.cohortId) {
      this.generatedUrl = config.clientUrl + '/' + data.type + '/' + data.id + '/calendar/' + data.cohortId;
    } else {
      this.generatedUrl = config.clientUrl + '/' + data.type + '/' + data.id;
    }
    this.tweetUrl = 'https://twitter.com/intent/tweet?text=Join me for the ' + this.data.type + ' ' + this.data.title + '&url=' + this.generatedUrl;
    this.LinkedInShareUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=' + this.generatedUrl + '&title=' + this.data.title + '&summary=Join me for the ' + this.data.type + ' ' + this.data.title + ' on ' + this.generatedUrl;
  }

  ngOnInit() {
  }

  public onCopySuccess() {
    this.snackBar.open('Copied to clipboard', 'Close');
  }

  public onEmailClicked() {
    window.location.href = 'mailto:' + '' + '?Subject=Want to join me for this ' + this.data.type + '?&body=Hey, I found this really fitting ' + this.data.type + ' ' + this.data.title + ' you should look at - ' + this.generatedUrl;
  }

  public onFBClicked() {
    FB.ui({
      method: 'share',
      display: 'popup',
      href: this.generatedUrl,
    }, function (response) { });
  }

  public onLinkedInClicked() {
    window.open(this.LinkedInShareUrl, 'MyWindow', 'width = 600, height = 300'); return false;
  }

}
