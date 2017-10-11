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
  //public step = 1;
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
    // this.idProofImagePending = true;
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
    //this.step = p;
   // this.router.navigate(['app-upload-docs', +this.step]);
   console.log("email dialog opened");
  }

  public resendOTP() {
    this._profileService.sendVerifyEmail(this.peer.controls.email.value)
      .subscribe();
  }

  verifyEmail() {
    this._profileService.confirmEmail(this.otp.controls['inputOTP'].value)
      .subscribe((res) => {
        console.log(res);
        this.success = res;
        this.router.navigate(['console/profile/verification']);
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

