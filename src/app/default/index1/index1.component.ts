import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { LoginComponentDialog } from '../../_services/dialogs/login-dialog/login-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';


@Component({
  selector: 'app-index1',
  templateUrl: './index1.component.html',
  styleUrls: ['./index1.component.scss']
})
export class IndexComponent1 implements OnInit {

  public isLoggedIn;
  public loggedIn = false;
  constructor(private _authService: AuthenticationService,
              private _router: Router,
              public dialog: MdDialog) {
    this.isLoggedIn = _authService.isLoggedIn();
    _authService.isLoggedIn().subscribe((res) => {
    setTimeout(()=>this.loggedIn=res,0);
    });
   }

  ngOnInit(){

  }

  ngAfterViewInit() {
  setTimeout(()=> {
  let dialogRef1: MdDialogRef<LoginComponentDialog>;

        dialogRef1= this.dialog.open(LoginComponentDialog);

        return dialogRef1.afterClosed();
  });
}
}