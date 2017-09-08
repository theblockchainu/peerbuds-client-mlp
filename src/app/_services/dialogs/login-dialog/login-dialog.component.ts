import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
//import {LoginComponent} from '../../../login/login.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: '../../../login/login.component.html',
  styleUrls: ['../../../login/login.component.scss']
})
export class LoginComponentDialog implements OnInit {

  public action;

  constructor(public dialogRef1: MdDialogRef<LoginComponentDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef1.close();
  }
  ngOnInit() {
  }

}