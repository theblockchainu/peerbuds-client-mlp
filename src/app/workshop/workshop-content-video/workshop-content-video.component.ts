import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {AppConfig} from '../../app.config';
import {Http} from '@angular/http';
import {MediaUploaderService} from '../../_services/mediaUploader/media-uploader.service';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import _ from 'lodash';

@Component({
    selector: 'app-workshop-content-video',
    templateUrl: './workshop-content-video.component.html',
    styleUrls: ['./workshop-content-video.component.scss']
})

export class WorkshopContentVideoComponent implements OnInit {

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

    constructor(
        private _fb: FormBuilder,
        private http: Http, private config: AppConfig,
        private mediaUploader: MediaUploaderService,
        @Inject(MD_DIALOG_DATA) public inputData: any,
        public dialogRef: MdDialogRef<WorkshopContentVideoComponent>
    ) {
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

    imageUploadNew(event) {
        for (const file of event.files) {
            this.mediaUploader.upload(file).map((responseObj: Response) => {
                const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
                const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
                contentForm.controls['imageUrl'].patchValue(responseObj.url);
                this.urlForVideo = responseObj.url;
            }).subscribe();
        }
    }

    deleteFromContainer(fileUrl, fileType) {
        const fileurl = fileUrl;
        fileUrl = _.replace(fileUrl, 'download', 'files');
        this.http.delete(this.config.apiUrl + fileUrl)
          .map((response) => {
            console.log(response);
            if (fileType === 'video') {
              this.urlForVideo = '';
              const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
              const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
              contentForm.controls['imageUrl'].patchValue(this.urlForVideo);
            } 
          }).subscribe();
    
    }
    
    //   deleteFromContainerArr(event, fileType) {
    //     for (let i = 0; i < event.target.files.length; i++) {
    //       let file = event.target.files[i];
    //       const fileurl = file;
    //       file = _.replace(file, 'download', 'files');
    //       this.http.delete(this.config.apiUrl + file)
    //         .map((response) => {
    //           console.log(response);
    //           if (fileType === 'video') {
    //             this.urlForVideo = _.remove(this.urlForVideo, function (n) {
    //               return n !== fileurl;
    //             });
    //             this.workshop.controls.videoUrls.patchValue(this.urlForVideo);
    //           } else if (fileType === 'image') {
    //             this.urlForImages = _.remove(this.urlForImages, function (n) {
    //               return n !== fileurl;
    //             });
    //             this.workshop.controls.imageUrls.patchValue(this.urlForImages);
    //           }
    //         }).subscribe();
    
    //     }
    //   }
    

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
