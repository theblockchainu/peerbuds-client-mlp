import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { MediaUploaderService } from '../../../_services/mediaUploader/media-uploader.service';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../../_services/project-submission/project-submission.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';
import 'rxjs/add/operator/map';
import {ContentService} from '../../../_services/content/content.service';
import _ from 'lodash';

@Component({
  selector: 'app-submit-entry',
  templateUrl: './submit-entry.component.html',
  styleUrls: ['./submit-entry.component.scss']
})
export class SubmitEntryComponent implements OnInit {

    private userId;
    public submitEntryForm: any = FormGroup;
    public imageUrl: string;
    public submissionTopics = [];
    public removedTopics = [];
    public relTopics = [];
    public isPrivate = true;
    public submissionId;
    public submissionView;
    public savingDraft = false;
    public loader = 'assets/images/ajax-loader.gif';
    public uploadingImage = false;
    public urlForImages = [];

    public searchTopicURL;
    public createTopicURL;
    public placeholderStringTopic = 'Submission Tag';
    public maxTopicMsg = 'Choose max 3 related tags';

    constructor(public config: AppConfig,
                @Inject(MD_DIALOG_DATA) public data: any,
                public dialog: MdDialog,
                private _fb: FormBuilder, public http: Http,
                private mediaUploader: MediaUploaderService,
                public projectSubmissionService: ProjectSubmissionService,
                private _cookieUtilsService: CookieUtilsService,
                private _contentService: ContentService
    ) {
        this.userId = _cookieUtilsService.getValue('userId');
        this.searchTopicURL = config.searchUrl + '/api/search/' + this.config.uniqueDeveloperCode + '_topics/suggest?field=name&query=';
        this.createTopicURL = config.apiUrl + '/api/' + this.config.uniqueDeveloperCode + '_topics';

    }

    ngOnInit() {
        this.submitEntryForm = this._fb.group({
            name: [''],
            picture_url: [],
            description: [''],
            isPrivate: [true]
        });
    }

    publishView() {
        const submissionForm = {
            name: this.submitEntryForm.controls['name'].value,
            description: this.submitEntryForm.controls['description'].value,
            picture_url: this.submitEntryForm.controls['picture_url'].value,
            isPrivate: this.submitEntryForm.controls['isPrivate'].value
        };
        this.savingDraft = true;
        this.projectSubmissionService.submitProject(this.data.content.id, submissionForm).subscribe((response: Response) => {
            if (response) {
                this.submissionView = response.json();
                this.savingDraft = false;

                this.projectSubmissionService.addPeerSubmissionRelation(this.userId, this.submissionView.id).subscribe((res: Response) => {
                    if (res) {
                        this.data.peerHasSubmission = true;
                    }
                });

                this.viewSubmission(this.submissionView.id);
            }
        });
    }

    public viewSubmission(submissionId) {
        const query = '{"include":[{"upvotes":"peer"}, {"peer": "profiles"}, {"comments": [{"peer": {"profiles": "work"}}, {"replies": [{"peer": {"profiles": "work"}}]}]}]}';
        this.projectSubmissionService.viewSubmission(submissionId, query).subscribe((response: Response) => {
            if (response) {
                const dialogRef = this.dialog.open(SubmissionViewComponent, {
                    data: {
                        userType: this.data.userType,
                        submission: response.json(),
                        peerHasSubmission: this.data.peerHasSubmission,
                        collectionId: this.data.collectionId
                    },
                    width: '45vw',
                    height: '100vh'
                });
            }
        });
    }

    public deleteFromContainer(fileUrl, fileType) {
        const fileurl = fileUrl;
        fileUrl = _.replace(fileUrl, 'download', 'files');
        this.http.delete(this.config.apiUrl + fileUrl)
            .map((response) => {
                console.log(response);
                this.urlForImages = [];
                this.submitEntryForm.controls['picture_url'].patchValue('');
            }).subscribe();
    }

    uploadImage(event) {
        this.uploadingImage = true;
        for (const file of event.files) {
            this.mediaUploader.upload(file).subscribe((response) => {
                this.addImageUrl(response.url);
                this.uploadingImage = false;
            });
        }
    }

    public addImageUrl(value) {
        console.log('Adding image url: ' + value);
        this._contentService.getMediaObject(value).subscribe((res) => {
            this.urlForImages.push(res[0]);
        });
        const control = <FormArray>this.submitEntryForm.controls['picture_url'];
        control.patchValue(value);
    }

}
