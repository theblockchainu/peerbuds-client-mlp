import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../_services/alert/alert.service';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-reset-pwd',  // <login></login>
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './app-reset-pwd.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './app-reset-pwd.component.html'
})
export class ResetPasswordComponent implements OnInit {
  // Set our default values
  // public loading = false;
  public returnUrl: string;
  isLoggedIn: Observable<boolean>;
  public passWord: string;
  public resetpwdForm: FormGroup;
  // TypeScript public modifiers

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialogRef: MdDialogRef<ResetPasswordComponent>,
    private _fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.isLoggedIn = this.authenticationService.isLoggedIn();
    }

  public ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.resetpwdForm = this._fb.group({
       password : ['', Validators.required] 
    });
  }
/*
  public resetpwd() {
      // this.loading = true;
      this.password = this.resetpwdForm.controls['password'].value;
      this.authenticationService.resetpwd(this.password)
          .subscribe(
              (data) => {
                  this.router.navigate([this.returnUrl]);
              },
              (error) => {
                  this.alertService.error(error._body);
                  // this.loading = false;

              });
  }
*/
  private redirect() {
    this.router.navigate([ this.returnUrl ]); // use the stored url here
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

