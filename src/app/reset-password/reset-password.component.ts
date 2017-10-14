import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../_services/alert/alert.service';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';


@Component({
  selector: 'app-reset-pwd',  // <login></login>
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './reset-password.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  // Set our default values
  // public loading = false;
  public returnUrl: string;

  isLoggedIn: Observable<boolean>;
  public passWord: string;
  public confirmpassWord: string;
  public email: string;
  public resetpwdForm: FormGroup;

  // TypeScript public modifiers

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
    private _fb: FormBuilder,
    ) {
      this.isLoggedIn = this.authenticationService.isLoggedIn();
      this.email = this.route.queryParams['value'].email;
    }

  public ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = '/login';

    this.resetpwdForm = this._fb.group({
       password : ['', Validators.required],
       confirmPassword : ['', Validators.required]
    });
  }
  
   public resetpwd(value: string) {
      // this.loading = true;
      this.passWord = this.resetpwdForm.controls['password'].value;
      this.confirmpassWord = this.resetpwdForm.controls['confirmpassword'].value;
      this.authenticationService.resetpwd(this.email, this.passWord)
          .subscribe(
              (data) => {
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
}
