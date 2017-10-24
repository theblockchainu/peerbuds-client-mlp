import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { MediaUploaderService } from '../../mediaUploader/media-uploader.service';
import { AppConfig } from '../../../app.config';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../../profile/profile.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-verify-email-dialog',
  templateUrl: './verify-email-dialog.component.html',
  styleUrls: ['./verify-email-dialog.component.scss']
})
export class VerifyEmailDialogComponent implements OnInit {
 public step = 2;
 // private idProofImagePending: Boolean;
  public peer: FormGroup;
  public otp: FormGroup;
  private email: string;
  private success;
  public otpReceived: string;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private mediaUploader: MediaUploaderService,
    private _fb: FormBuilder,
    public _profileService: ProfileService,
    private http: Http,
    private config: AppConfig,
    public dialogRef: MdDialogRef<VerifyEmailDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.activatedRoute.params.subscribe(params => {
      });
  }

  ngOnInit() {
    this.peer = this._fb.group({
      email: ['',
      [Validators.required,
      Validators.pattern(EMAIL_REGEX)]],
      verificationIdUrl: ['', Validators.required]
    });

    this.otp = this._fb.group({
      inputOTP: [null]
    });
    this._profileService.getPeerNode()
      .subscribe((res) => {
        this.peer.controls.email.setValue(res.email);
      });
  }

  continue(p) {
    this.step = p;
   // this.router.navigate(['app-upload-docs', +this.step]);
   console.log('email dialog opened');
   if (p === 3) {
    //this.peer.controls['email'].setValue(this.email);
    this.sendOTP();
  }
  }

  public sendOTP() {
    this._profileService.sendVerifyEmail(this.peer.controls.email.value)
      .subscribe();
  }

  public resendOTP(message: string, action) {
    //message = "Code resent!";
    //action = "OK"
    //let snackBarRef = this.snackBar.open(message,action);
    this._profileService.sendVerifyEmail(this.peer.controls.email.value)
      .subscribe();
  }

  verifyEmail() {
    this._profileService.confirmEmail(this.otp.controls['inputOTP'].value)
      .subscribe((res) => {
        console.log(res);
        console.log('verified email');
        this.success = res;
        //this.router.navigate(['/onboarding/1']);
        this.dialogRef.close();
      });
  }
}

