import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
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
  private uploadingImage = false;
  private idProofImagePending: Boolean;
  public peer: FormGroup;
  private email: string;
  private success;
  private verificationIdUrl: string;
  private fileType;
  private fileName;

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
    console.log('dialog opened');
    this._profileService
    .updatePeer({ 'verificationIdUrl': this.peer.controls['verificationIdUrl'].value})
    .subscribe((response) => {
      console.log('File Saved Successfully');
    }, (err) => {
      console.log('Error updating Peer: ');
      console.log(err);
    });
     this.dialogRef.close();
  }

  uploadImage(event) {
    //this.peer.controls['email'].setValue(this.email);
    this.uploadingImage = true;
    console.log(event.files);
    for (const file of event.files) {
      this.fileName = file.name;
      this.mediaUploader.upload(file).map((responseObj) => {
        this.verificationIdUrl = responseObj.url;
        this.fileType = responseObj.type;
        this.peer.controls['verificationIdUrl'].setValue(responseObj.url);
        this.uploadingImage = false;
      }).subscribe();
    }
  }

  deleteFromContainer(url: string, type: string) {
    if (type === 'image' || type === 'file') {
      this._profileService.updatePeer({
        'verificationIdUrl': ''
      }).subscribe(response => {
        this.verificationIdUrl = response.picture_url;
      });
    } else {
      console.log('error');
    }
  }
}

