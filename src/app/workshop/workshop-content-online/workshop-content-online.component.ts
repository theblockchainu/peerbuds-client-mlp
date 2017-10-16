import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { AppConfig } from '../../app.config';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import _ from 'lodash';
import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';

@Component({
    selector: 'app-workshop-content-online',
    templateUrl: './workshop-content-online.component.html',
    styleUrls: ['./workshop-content-online.component.scss']
})

export class WorkshopContentOnlineComponent implements OnInit {

    public lastIndex: number;
    public filesToUpload: number;
    public filesUploaded: number;
    public itenaryForm: FormGroup;
    public image: any;
    public attachments: any;
    public attachmentUrls = [];
    public resultData = {
        status: 'discard',
        data: 0
    };
    public isEdit = false;
    private uploadingImage = false;
    private uploadingAttachments = false;
    private contentId;
    private options;

    constructor(
        private _fb: FormBuilder,
        private http: Http,
        public config: AppConfig,
        private mediaUploader: MediaUploaderService,
        @Inject(MD_DIALOG_DATA) public inputData: any,
        public dialogRef: MdDialogRef<WorkshopContentOnlineComponent>,
        private requestHeaders: RequestHeaderService
    ) {
        this.options = requestHeaders.getOptions();
        this.itenaryForm = inputData.itenaryForm;
        this.lastIndex = inputData.index;
        this.isEdit = inputData.isEdit;
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        this.image = contentForm.controls['imageUrl'];
        this.attachments = contentForm.controls['supplementUrls'];
        this.attachmentUrls = this.attachments.value;
        console.log(this.attachments);
    }

    ngOnInit(): void {
        const content = <FormArray>this.itenaryForm.controls.contents;
        this.lastIndex = this.lastIndex !== -1 ? this.lastIndex : content.controls.length - 1;
        this.resultData['data'] = this.lastIndex;
    }

    imageUploadNew(event) {
        for (const file of event.files) {
            this.mediaUploader.upload(file).map((responseObj: Response) => {
                const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
                const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
                contentForm.controls['imageUrl'].patchValue(responseObj.url);
            }).subscribe();
        }
    }

    uploadNew(event) {
        console.log(event.files);
        this.filesToUpload = event.files.length;
        this.filesUploaded = 0;
        for (const file of event.files) {
            this.mediaUploader.upload(file).map((responseObj: Response) => {
                const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
                const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
                const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
                supplementUrls.reset();
                supplementUrls.push(this._fb.control(responseObj.url));
                this.filesUploaded++;
            }).subscribe();
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

    /**
     * Get data to return on closing this dialog.
     * @returns {any}
     */
    getSaveDialogData() {
        console.log('changing result data to save');
        this.resultData['status'] = 'save';
        return JSON.stringify(this.resultData);
    }

    /**
     * Get data to return on editing this dialog.
     * @returns {any}
     */
    getEditDialogData() {
        console.log('changing result data to save');
        this.resultData['status'] = 'edit';
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

    uploadImage(event) {
        this.uploadingImage = true;
        for (const file of event.files) {
          this.mediaUploader.upload(file).subscribe((response) => {
            this.addImageUrl(response.url);
            this.uploadingImage = false;
          });
        }
    }

    public addImageUrl(value: String) {
        console.log('Adding image url: ' + value);
        this.image.patchValue(value);
    }

    uploadAttachments(event) {
        this.uploadingAttachments = true;
        for (const file of event.files) {
          this.mediaUploader.upload(file).subscribe((response) => {
            this.addAttachmentUrl(response.url);
            this.uploadingAttachments = false;
          });
        }
    }

    public addAttachmentUrl(value: String) {
        console.log('Adding image url: ' + value);
        this.attachments.push(new FormControl(value));
        this.attachmentUrls.push(value);
    }

    imgErrorHandler(event) {
        event.target.src = '/assets/images/placeholder-image.jpg';
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
                const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
                let suppUrl = supplementUrls.value;
                suppUrl = _.remove(suppUrl, function (n) {
                    return n !== fileurl;
                });
                this.attachmentUrls = suppUrl;
                contentForm.controls['supplementUrls'].patchValue(suppUrl);
                if (contentForm.controls['id'].value) {
                    this.deleteFromContent(contentForm);
                }
            } else if (fileType === 'image') {
                this.addImageUrl('');
                const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
                const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
                contentForm.controls['imageUrl'].patchValue('');
                if (contentForm.controls['id'].value) {
                    this.deleteFromContent(contentForm);
                }
            }
          }).subscribe((response) => {

          });

    }

    deleteFromContent(contentForm) {
        const body = {'imageUrl': ''};
        this.http.patch(this.config.apiUrl + '/api/contents/' + contentForm.controls['id'].value, body, this.options)
        .map((response: Response) => {})
        .subscribe();
    }

}
