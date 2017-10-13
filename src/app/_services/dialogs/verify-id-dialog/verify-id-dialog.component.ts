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
  selector: 'app-verify-id-dialog',
  templateUrl: './verify-id-dialog.component.html',
  styleUrls: ['./verify-id-dialog.component.scss']
})
export class VerifyIdDialogComponent implements OnInit {
  private idProofImagePending: Boolean;
  public peer: FormGroup;
  public otp: FormGroup;
  private email: string;
  private success;
  public otpReceived: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private _fb: FormBuilder,
    private http: Http,
    private mediaUploader: MediaUploaderService,
    private config: AppConfig,
    public _profileService: ProfileService,
    public dialogRef: MdDialogRef<VerifyIdDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  this.idProofImagePending = true;
    this.peer = this._fb.group({
      email: ['',
      [Validators.required,
      Validators.pattern(EMAIL_REGEX)]],
      verificationIdUrl: ['', Validators.required]
    });
         
  }
  continue() {
    //this.router.navigate(['app-upload-docs', +this.step]);
    console.log("dialog opened");
     this.dialogRef.close();
     this.router.navigate(['console/profile/verification']);
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

