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
  selector: 'app-verify-phone-dialog',
  templateUrl: './verify-phone-dialog.component.html',
  styleUrls: ['./verify-phone-dialog.component.scss']
})
export class VerifyPhoneDialogComponent implements OnInit {
// public step = 1;
 // private idProofImagePending: Boolean;
  public peer: FormGroup;
  public otp: FormGroup;
  //private email: string;
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
    public dialogRef: MdDialogRef<VerifyPhoneDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.activatedRoute.params.subscribe(params => {
      });
  }

  ngOnInit() {
    this.otp = this._fb.group({
      inputOTP: [null]
    });
    this._profileService.getPeerNode()
      .subscribe((res) => {
        this.peer.controls.email.setValue(res.email);
      });
  }

  continue() {
   // this.step = p;
   // this.router.navigate(['app-upload-docs', +this.step]);
   console.log('phone dialog opened');
    //this.peer.controls['email'].setValue(this.email);
    //this.sendOTP();
  }

  public sendOTP() {
    this._profileService.sendVerifySms(this.peer.controls.phone.value)
      .subscribe();
  }

  public resendOTP(message: string, action) {
    //message = "Code resent!";
    //action = "OK"
    //let snackBarRef = this.snackBar.open(message,action);
    this._profileService.sendVerifySms(this.peer.controls.phone.value)
      .subscribe();
  }

  verifyPhone() {
    this._profileService.confirmSmsOTP(this.otp.controls['inputOTP'].value)
      .subscribe((res) => {
        console.log(res);
        console.log('verified phone');
        this.success = res;
        //this.router.navigate(['/onboarding/1']);
        this.dialogRef.close();
      });
  }
/*
  uploadImage(event) {
    this.peer.controls['email'].setValue(this.email);
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj) => {
        // this.peer.controls['verificationIdUrl'].setValue(responseObj.url);
        this.idProofImagePending = false;
      }).subscribe();
    }
    this.idProofImagePending = false;
  }
  */
}

