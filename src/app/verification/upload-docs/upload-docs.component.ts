import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../../app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { CollectionService } from '../../_services/collection/collection.service';

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
    private mediaUploader: MediaUploaderService,
    private _fb: FormBuilder,
    public _collectionService: CollectionService,
    private http: Http,
    private config: AppConfig) {
    }

  ngOnInit() {
    this.peer = this._fb.group({
      email: '',
      verificationIdUrl: ['', Validators.required]
    });

    this.otp = this._fb.group({
      inputOTP: ['']
    });
    this._collectionService.getPeerNode()
        .subscribe((res) => this.email = res.email);
  }

  continue(p){
    if(p === 4) {
      this.resendOTP();
    }
    this.step = p;
  }

  public resendOTP() {
    this._collectionService.sendVerifyEmail()
        .subscribe((res) => this.otp.controls['inputOTP'].setValue(res.verificationToken));
  }

  verifyEmail(){
    this._collectionService.confirmEmail(this.otp.controls['inputOTP'].value, 'onboarding')
        .subscribe((res) => this.success = res);
  }

  redirectToOnboarding() {
    this.router.navigate(['onboarding']);
  }

  uploadImage(event) {
    this.peer.controls['email'].setValue(this.email);
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        this.peer.controls['verificationIdUrl'].setValue(responseObj.url);
        this.idProofImagePending = false;
      }).subscribe();
    }
    this.idProofImagePending = false;
  }

}
