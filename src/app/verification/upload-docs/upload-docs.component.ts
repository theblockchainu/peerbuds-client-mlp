import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { ProfileService } from '../../_services/profile/profile.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {
  public step = 1;
  private idProofImagePending: Boolean;
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
    private config: AppConfig) {
      this.activatedRoute.params.subscribe(params => {
        this.step = params['step'];
      });
  }

  ngOnInit() {
    this.idProofImagePending = true;
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
      .subscribe((res) => this.email = res.email);
  }

  continue(p) {
    if (p === 3) {
      this.resendOTP();
    }
    this.step = p;
    this.router.navigate(['app-upload-docs', +this.step]);
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
        this.router.navigate(['onboarding']);
      });
  }

  redirectToOnboarding() {
    this.router.navigate(['onboarding/1']);
  }

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
}

