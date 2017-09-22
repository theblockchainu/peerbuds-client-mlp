import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../../alert/alert.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable } from 'rxjs';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {ForgotpwdComponentDialog} from '../forgot-pwd-dialog/forgot-pwd-dialog.component';
import {AppConfig} from '../../../app.config';

@Component({
  selector: 'app-login-dialog',  // <login></login>
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './login-dialog.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './login-dialog.component.html'
})
export class LoginComponentDialog implements OnInit {
  // Set our default values
  // public loading = false;
  public returnUrl: string;
  isLoggedIn: Observable<boolean>;
  public email: string;
  public passWord: string;
  public loginForm: FormGroup;
  public forgotpwdForm: FormGroup;
  // TypeScript public modifiers

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialogRef: MdDialogRef<LoginComponentDialog>,
    private _fb: FormBuilder,
    public config: AppConfig,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.isLoggedIn = this.authenticationService.isLoggedIn();
    }

  public ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/homefeed';

    this.loginForm = this._fb.group({
      email : ['', Validators.required], /* putting reg ex as well */
      password : ['', Validators.required]
    });
      this.forgotpwdForm = this._fb.group({
      email : ['', Validators.required] /* putting reg ex as well */
    });
  }

  public login() {
      // this.loading = true;
      this.email = this.loginForm.controls['email'].value;
      this.passWord = this.loginForm.controls['password'].value;
      this.authenticationService.login(this.email, this.passWord)
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
