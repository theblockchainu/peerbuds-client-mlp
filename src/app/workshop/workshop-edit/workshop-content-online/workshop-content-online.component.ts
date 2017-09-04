import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { AppConfig } from '../../../app.config';
import { MediaUploaderService } from '../../../_services/mediaUploader/media-uploader.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

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

    constructor(
        private _fb: FormBuilder,
        private http: Http,
        public config: AppConfig,
        private mediaUploader: MediaUploaderService,
        @Inject(MD_DIALOG_DATA) public inputData: any,
        public dialogRef: MdDialogRef<WorkshopContentOnlineComponent>
    ) {
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
        console.log('upload xhr is: ' + JSON.stringify(event.xhr.response));
        const xhrResp = JSON.parse(event.xhr.response);
        this.addImageUrl(xhrResp.url);
    }

    public addImageUrl(value: String) {
        console.log('Adding image url: ' + value);
        this.image.patchValue(value);
    }

    uploadAttachments(event) {
        console.log('upload xhr is: ' + JSON.stringify(event.xhr.response));
        const xhrResp = JSON.parse(event.xhr.response);
        this.addAttachmentUrl(xhrResp.url);
    }

    public addAttachmentUrl(value: String) {
        console.log('Adding image url: ' + value);
        this.attachments.push(new FormControl(value));
        this.attachmentUrls.push(value);
    }

    imgErrorHandler(event) {
        event.target.src = '/assets/images/placeholder-image.jpg';
    }

}
