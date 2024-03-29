import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Http} from '@angular/http';
import {AppConfig} from '../../app.config';
import {MediaUploaderService} from '../../_services/mediaUploader/media-uploader.service';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import _ from 'lodash';
import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';
import { ContentService } from '../../_services/content/content.service';

@Component({
    selector: 'app-workshop-content-project',
    templateUrl: './workshop-content-project.component.html',
    styleUrls: ['./workshop-content-project.component.scss']
})

export class WorkshopContentProjectComponent implements OnInit {

    public lastIndex: number;
    public filesToUpload: number;
    public filesUploaded: number;
    public itenaryForm: FormGroup;
    public resultData = {
        status: 'discard',
        data: 0
    };
    public isEdit = false;
    public collectionStartDate;
    public collectionEndDate;
    public urlForVideo;
    public mediaObject;
    private uploadingVideo;
    private uploadingAttachments;
    public attachments: any;
    public attachmentUrls = [];
    private options;

    constructor(
        private _fb: FormBuilder,
        private http: Http, private config: AppConfig,
        private mediaUploader: MediaUploaderService,
        @Inject(MD_DIALOG_DATA) public inputData: any,
        public dialogRef: MdDialogRef<WorkshopContentProjectComponent>,
        private requestHeaders: RequestHeaderService,
        private contentService: ContentService
    ) {
        this.options = requestHeaders.getOptions();
        this.collectionEndDate = inputData.collectionEndDate;
        this.collectionStartDate = inputData.collectionStartDate;
        this.itenaryForm = inputData.itenaryForm;
        this.lastIndex = inputData.index;
        this.isEdit = inputData.isEdit;
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        this.urlForVideo = contentForm.controls['imageUrl'].value;
        this.contentService.getMediaObject(this.urlForVideo).subscribe((res) => {
            this.mediaObject = res[0];
        });
        this.attachments = contentForm.controls['supplementUrls'];
        this.attachments.value.forEach(file => {
            this.contentService.getMediaObject(file).subscribe((res) => {
                this.attachmentUrls.push(res[0]);
            });
        });
        console.log(this.attachmentUrls);
    }

    ngOnInit(): void {
        const content = <FormArray>this.itenaryForm.controls.contents;
        this.lastIndex = this.lastIndex !== -1 ? this.lastIndex : content.controls.length - 1;
        this.resultData['data'] = this.lastIndex;
    }

    uploadNew(event) {
        console.log(event.files);
        this.uploadingAttachments = true;
        for (const file of event.files) {
          this.mediaUploader.upload(file).subscribe((response) => {
            this.addAttachmentUrl(response);
            this.filesUploaded++;
            this.uploadingAttachments = false;
          });
        }
    }

    addAttachmentUrl(response: any) {
        console.log('Adding image url: ' + response.url);
        this.attachments.push(new FormControl(response.url));
        this.attachmentUrls.push(response);
    }

    deleteFromContainer(fileUrl, fileType) {
        const fileurl = fileUrl;
        fileUrl = _.replace(fileUrl, 'download', 'files');
        this.http.delete(this.config.apiUrl + fileUrl)
          .map((response) => {
            console.log(response);
            if (fileType === 'file') {
                const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
                const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
                let supplementUrls = <FormArray>contentForm.controls.supplementUrls;
                let suppUrl = supplementUrls.value;
                suppUrl = _.remove(suppUrl, function (n) {
                    return n !== fileurl;
                });
                contentForm.controls['supplementUrls'] = new FormArray([]);
                this.attachmentUrls = [];
                suppUrl.forEach(file => {
                    supplementUrls.push(new FormControl(file));
                    this.contentService.getMediaObject(file).subscribe((res) => {
                        this.attachmentUrls.push(res[0]);
                    })
                });
            } 
            else {
              this.urlForVideo = '';
              this.mediaObject = {};
              const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
              const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
              contentForm.controls['imageUrl'].patchValue(this.urlForVideo);
              if(contentForm.controls['id'].value) {
                  this.deleteFromContent(contentForm, {'imageUrl': ''});
              }
            } 
          }).subscribe();
    
    }

    deleteFromContent(contentForm, body) {
        this.http.patch(this.config.apiUrl + '/api/contents/' + contentForm.controls['id'].value, body, this.options)
        .map((response) => {})
        .subscribe();
    }
    
    imageUploadNew(event) {
        this.uploadingVideo = true;
        for (const file of event.files) {
          this.mediaUploader.upload(file).subscribe((response) => {
            this.urlForVideo = response.url; 
            const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
            const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
            contentForm.controls['imageUrl'].patchValue(response.url);
            this.mediaObject = response;
            this.uploadingVideo = false;
            });
        }
    }

    resetNewUrls(event) {
        console.log(event);
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
        supplementUrls.reset();
        this.resetProgressBar();
    }

    resetProgressBar() {
        delete this.filesToUpload;
        delete this.filesUploaded;
    }

    itemEditRemoved(event) {
        delete this.filesToUpload;
        this.filesUploaded = 0;
        //this.deleteFromContainer(event);
    }

    /**
     * Get data to return on closing this dialog.
     * @returns {any}
     */
    getSaveDialogData() {
        console.log('changing result data to save');
        console.log(this.resultData);
        this.resultData['status'] = 'save';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get data to return on discarding this dialog
     * @returns {any}
     */
    getDiscardDialogData() {
        this.resultData['status'] = 'discard';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get data to return on editing this dialog.
     * @returns {any}
     */
    getEditDialogData() {
        console.log('changing result data to save');
        console.log(this.resultData);
        this.resultData['status'] = 'edit';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get data to return on discarding this dialog
     * @returns {any}
     */
    getDeleteDialogData() {
        this.resultData['status'] = 'delete';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get data to return on discarding this dialog
     * @returns {any}
     */
    getCloseDialogData() {
        this.resultData['status'] = 'close';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get title text based on edit mode or add mode
     * @returns {any}
     */
    getAddOrEditText() {
        if (!this.isEdit) {
            return 'Add';
        }
        else {
            return 'Edit';
        }
    }

}