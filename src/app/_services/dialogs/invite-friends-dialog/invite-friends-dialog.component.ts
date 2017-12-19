import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-invite-friends-dialog',
  templateUrl: './invite-friends-dialog.component.html',
  styleUrls: ['./invite-friends-dialog.component.scss']
})
export class InviteFriendsDialogComponent implements OnInit {

  public url = '';
  public loggedinUserEmail = '';
  constructor(
    public dialogRef: MdDialogRef<InviteFriendsDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar
  ) {
    this.url = data.url;
  }

  ngOnInit() {
  }

  public onCopySuccess() {
    this.snackBar.open('Copied to clipboard', 'Close');
  }

  public onEmailClicked() {
    window.location.href = 'mailto:' + this.loggedinUserEmail + '?Subject=Want to join me for this experience?&body=Hey, I found this really fitting experience you should look at - http://localhost:8080/' + this.url;
  }

}
