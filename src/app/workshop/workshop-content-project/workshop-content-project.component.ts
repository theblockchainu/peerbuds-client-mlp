import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Http} from '@angular/http';
import {AppConfig} from '../../app.config';
import {MediaUploaderService} from '../../_services/mediaUploader/media-uploader.service';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import _ from 'lodash';
import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';

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
        private requestHeaders: RequestHeaderService
    ) {
        this.options = requestHeaders.getOptions();
        this.itenaryForm = inputData.itenaryForm;
        this.lastIndex = inputData.index;
        this.isEdit = inputData.isEdit;
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        this.urlForVideo = contentForm.controls['imageUrl'].value;
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
            const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
            const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
            const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
            supplementUrls.reset();
            
            this.addAttachmentUrl(response.url);
            this.filesUploaded++;
            this.uploadingAttachments = false;
          });
        }
    }

    addAttachmentUrl(value: String) {
        console.log('Adding image url: ' + value);
        // this.attachments.push(new FormControl(value));
        this.attachmentUrls.push(value);
    }

    deleteFromContainer(fileUrl, fileType) {
        // const fileurl = fileUrl;
        // fileUrl = _.replace(fileUrl, 'download', 'files');
        // this.http.delete(this.config.apiUrl + fileUrl)
        //   .map((response) => {
        //     console.log(response);
        //     if (fileType === 'video') {
        //       this.urlForVideo = '';
        //       const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        //       const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        //       contentForm.controls['imageUrl'].patchValue(this.urlForVideo);
        //     } 
        //   }).subscribe();
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
                this.attachmentUrls = suppUrl;
                contentForm.controls['supplementUrls'].patchValue(suppUrl);
                if(contentForm.controls['id'].value) {
                    this.deleteFromContent(contentForm);
                }
            } 
            else {
              this.urlForVideo = '';
              this.mediaObject = {};
              const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
              const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
              contentForm.controls['imageUrl'].patchValue(this.urlForVideo);
            } 
          }).subscribe();
    
    }

    deleteFromContent(contentForm) {
        const body = {'imageUrl': ''};
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