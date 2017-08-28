import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { MediaUploaderService } from '../../../_services/mediaUploader/media-uploader.service';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';

@Component({
  selector: 'app-submit-entry',
  templateUrl: './submit-entry.component.html',
  styleUrls: ['./submit-entry.component.scss']
})
export class SubmitEntryComponent implements OnInit {

  public submitEntryForm: any = FormGroup;

  constructor(public config: AppConfig,
  @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    private _fb: FormBuilder, private http: Http,
    private mediaUploader: MediaUploaderService
  ) { }

  ngOnInit() {
    this.submitEntryForm = this._fb.group({
      title: [''],
      picture_url: [''],
      name: [''],
      description: [''],
      tags: [''],
      isPrivate: ['false']
    });
  }

  publishView() {
    const dialogRef = this.dialog.open(SubmissionViewComponent, {
      width: '800px'
    });
    console.log(this.submitEntryForm.value);
  }
}
