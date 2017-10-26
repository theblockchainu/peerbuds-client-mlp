import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { MediaUploaderService } from '../../mediaUploader/media-uploader.service';
import { AppConfig } from '../../../app.config';
import { MdSnackBar } from '@angular/material';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-verify-phone-dialog',
  templateUrl: './verify-phone-dialog.component.html',
  styleUrls: ['./verify-phone-dialog.component.scss']
})
export class VerifyPhoneDialogComponent implements OnInit {
  public step = 2;
  public peer: FormGroup;
  public otp: FormGroup;
  private phone: number;
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
    public snackBar: MdSnackBar,
    public dialogRef: MdDialogRef<VerifyPhoneDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.activatedRoute.params.subscribe(params => {
      });
  }

  ngOnInit() {
    this.peer = this._fb.group({
      phone: ['', Validators.required]
    });

    this.otp = this._fb.group({
      inputOTP: [null]
    });
    this._profileService.getPeerNode()
      .subscribe((res) => {
        this.peer.controls.phone.setValue(res.phone);
      });
  }

  continue(p) {
    this.step = p;
   console.log('phone dialog opened');
   this._profileService
   .updatePeer({'phone': this.peer.controls['phone'].value})
    .subscribe();
    if (p === 3) {
      //this.peer.controls['phone'].setValue(this.phone);
      this.sendOTP();
     }
  }

  public sendOTP() {
    this._profileService.sendVerifySms(this.peer.controls.phone.value)
      .subscribe();
  }

  public resendOTP(message: string, action) {
    this._profileService.sendVerifyEmail(this.peer.controls.phone.value)
      .subscribe((response) => {
        this.snackBar.open('Code Resent', 'OK'); });
    }

  verifyPhone() {
    //this.peer.controls['phone'].setValue(this.phone);
    this._profileService.confirmSmsOTP(this.otp.controls['inputOTP'].value)
      .subscribe((res) => {
        console.log(res.phone);
        console.log('verified phone');
        this.success = res;
        //this.peer.controls.phone.setValue(res.phone);
        this.dialogRef.close();
      });
  }
}

