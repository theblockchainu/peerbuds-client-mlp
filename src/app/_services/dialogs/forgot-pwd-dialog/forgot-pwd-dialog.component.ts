import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../../alert/alert.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable } from 'rxjs';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-forgot-pwd-dialog',  // <login></login>
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './forgot-pwd-dialog.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './forgot-pwd-dialog.component.html'
})
export class ForgotpwdComponentDialog implements OnInit {
  // Set our default values
  // public loading = false;
  public returnUrl: string;
  isLoggedIn: Observable<boolean>;
  public email: string;
  public passWord: string;
  public forgotpwdForm: FormGroup;
  // TypeScript public modifiers

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ForgotpwdComponentDialog>,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isLoggedIn = this.authenticationService.isLoggedIn();
    }

  public ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.forgotpwdForm = this._fb.group({
      email : ['', Validators.required] /* putting reg ex as well */
    });
  }

  public getpwd() {
      // this.loading = true;
      this.email = this.forgotpwdForm.controls['email'].value;
      this.authenticationService.getpwd(this.email)
          .subscribe(
              (data) => {
                  this.dialogRef.close();
                  this.router.navigate([this.returnUrl]);
              },
              (error) => {
                  this.alertService.error(error._body);
                  // this.loading = false;
              });
  }

  private redirect() {
    this.router.navigate([ this.returnUrl ]); // use the stored url here
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    }

