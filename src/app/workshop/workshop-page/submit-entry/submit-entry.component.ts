import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { MediaUploaderService } from '../../../_services/mediaUploader/media-uploader.service';
import {FileUploadModule} from 'primeng/primeng';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../../_services/project-submission/project-submission.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-submit-entry',
  templateUrl: './submit-entry.component.html',
  styleUrls: ['./submit-entry.component.scss']
})
export class SubmitEntryComponent implements OnInit {

  public submitEntryForm: any = FormGroup;
  public imageUrl: string ;
  public submissionTopics = [];
  public removedTopics = [];
  public relTopics = [];
  public isPrivate = true;
  public submissionId;
  public submissionView;
  public savingDraft = false;
  public loader= 'assets/images/ajax-loader.gif';

  public searchTopicURL = 'http://localhost:4000/api/search/topics/suggest?field=name&query=';
  public createTopicURL = 'http://localhost:3000/api/topics';
  public placeholderStringTopic = 'Submission Tag';
  public maxTopicMsg = 'Choose max 3 related tags';

  constructor(public config: AppConfig,
  @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    private _fb: FormBuilder, private http: Http,
    private mediaUploader: MediaUploaderService,
    public projectSubmissionService: ProjectSubmissionService
  ) { }

  ngOnInit() {
    this.submitEntryForm = this._fb.group({
      name: [''],
      picture_url: [''],
      description: [''],
      // tags: ['']
      isPrivate: ['true']
    });
  }

  publishView() {
    const submissionForm = {
      name: this.submitEntryForm.controls['name'].value,
      description: this.submitEntryForm.controls['description'].value,
      picture_url : this.submitEntryForm.controls['picture_url'].value,
      isPrivate: this.submitEntryForm.controls['isPrivate'].value
    };
    this.savingDraft = true;
    this.projectSubmissionService.submitProject((this.data.content.id), submissionForm).subscribe((response: Response) => {
      this.submissionView = response.json();
      // this.submissionId = response.json().id;
      // console.log(response.json());
      this.savingDraft = false;
      this.viewSubmission(this.submissionView.id);
    });
  }

  public viewSubmission(submissionId) {
    this.projectSubmissionService.viewSubmission(submissionId).subscribe((response: Response) => {
      if (response) {
        const dialogRef = this.dialog.open(SubmissionViewComponent, {
          data: {
            userType: this.data.userType,
            submission: response.json()
          },
          width: '800px'
        });
      }
    });
  }

  public addUrl(value: String) {
    const control = <FormArray>this.submitEntryForm.controls['picture_url'];
    control.push(new FormControl(value));
  }

   uploadImage(event) {
      // console.log(event.files);

    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        // this.addUrl(responseObj.url);
        this.submitEntryForm.controls['picture_url'].setValue(responseObj.url);
        // console.log(responseObj);
      }).subscribe();
    }
  }

}
