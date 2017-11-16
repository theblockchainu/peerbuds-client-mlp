import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { MdDialog, MdDialogConfig, MdDialogRef, MdSnackBar } from '@angular/material';
import { DialogsService } from '../../_services/dialogs/dialog.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {
  public step = 1;
  private uploadingImage = false;
  public peer: FormGroup;
  public otp: FormGroup;
  private email: string;
  private success;
  public otpReceived: string;
  private verificationIdUrl: string;
  private fileType;
  private fileName;
  public userId;
  private otpError: string;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private mediaUploader: MediaUploaderService,
    private _fb: FormBuilder,
    public _profileService: ProfileService,
    private http: Http,
    private config: AppConfig,
    public snackBar: MdSnackBar,
    private dialog: MdDialog,
    private dialogsService: DialogsService,
    private _cookieUtilsService: CookieUtilsService) {
      this.activatedRoute.params.subscribe(params => {
        this.step = params['step'];
      });
      this.userId = _cookieUtilsService.getValue('userId');
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
    this._profileService.getPeerNode(this.userId)
      .subscribe((res) => {
        this.peer.controls.email.setValue(res.email);
      });
  }

  continue(p) {
    if (p === 2) {
      this._profileService
      .updatePeer(this.userId, { 'verificationIdUrl': this.peer.controls['verificationIdUrl'].value, 'email': this.peer.controls['email'].value })
      .subscribe((response) => {
        console.log('File Saved Successfully');
      }, (err) => {
        console.log('Error updating Peer: ');
        console.log(err);
      });
    }
    if (p === 3) {
      //this.peer.controls['email'].setValue(this.email);
      this.sendOTP();
    }
    this.step = p;
    this.router.navigate(['app-upload-docs', +this.step]);
  }

  public sendOTP() {
    this._profileService.sendVerifyEmail(this.userId, this.peer.controls.email.value)
      .subscribe();
      console.log('mail sent');
  }


  public resendOTP(message: string, action) {
    this._profileService.sendVerifyEmail(this.userId, this.peer.controls.email.value)
      .subscribe((response) => {
        this.snackBar.open('Code Resent', 'OK'); });
    }

  verifyEmail() {
    this._profileService.confirmEmail(this.userId, this.otp.controls['inputOTP'].value)
      .subscribe((res) => {
          console.log(res);
          console.log('verified email');
          this.success = res;
          this.router.navigate(['/onboarding/1']);
        },
        (err) => {
          console.log(err);
          if(err.status === 400) {
            this.otpError = "Wrong or Invalid OTP";
            //this.otp.controls['inputOTP'].setValue('');
          }

        }
    );
  }

  redirectToOnboarding() {
    this.router.navigate(['/onboarding/1']);
  }

  uploadImage(event) {
    //this.peer.controls['email'].setValue(this.email);
    this.uploadingImage = true;
    console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj) => {
        this.verificationIdUrl = responseObj.url;
        this.fileName = responseObj['originalFilename'];
        this.fileType = responseObj.type;
        this.peer.controls['verificationIdUrl'].setValue(responseObj.url);
        this.uploadingImage = false;
      }).subscribe();
    }
  }

  deleteFromContainer(url: string, type: string) {
    if (type === 'image' || type === 'file') {
      this._profileService.updatePeer(this.userId, {
        'verificationIdUrl': ''
      }).subscribe(response => {
        this.verificationIdUrl = response.picture_url;
      });
    } else {
      console.log('error');
    }
  }
  public openIdPolicy() {
    this.dialogsService.openIdPolicy().subscribe();
  }
}
