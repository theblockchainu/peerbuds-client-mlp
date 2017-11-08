import { Component, OnInit } from '@angular/core';
import { LoginComponentDialog } from '../../_services/dialogs/login-dialog/login-dialog.component';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';

import { MdDialogRef, MdDialog, MdDialogConfig, MdSnackBar } from '@angular/material';
import { DialogsService } from '../../_services/dialogs/dialog.service';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
//import { DefaultComponent } from '../default.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  private email: string;
  notifyForm: FormGroup;
  public isLoggedIn;
  public loggedIn = false;
  constructor(
            private authenticationService: AuthenticationService,
             public _fb: FormBuilder,
              private _router: Router,
              public dialog: MdDialog,
              private http: Http,
              public snackBar: MdSnackBar,
              private dialogsService: DialogsService) {
              this.isLoggedIn = authenticationService.isLoggedIn();
              authenticationService.isLoggedIn().subscribe((res) => {
                this.loggedIn = res;
                if (this.loggedIn) {
                  setTimeout(() => this._router.navigate(['home', 'homefeed']));
                }
              });
   }
   ngOnInit() {
    this.notifyForm = this._fb.group(
      {email: ['', Validators.requiredTrue]}
    );
   }
   public openVideo() {
    this.dialogsService.openVideo().subscribe();
  }
  public sendEmailSubscriptions(message: string, action: string) {
    // this.loading = true;
      this.email = this.notifyForm.controls['email'].value;
      this.authenticationService.sendEmailSubscriptions(this.email)
        .subscribe(
          //(response) => {this.snackBar.open('Email Subscribed', 'OK'); });
        );
        this.snackBar.open('Email Subscribed', 'OK');
}
}
