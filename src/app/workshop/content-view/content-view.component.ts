import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { AppConfig } from '../../app.config';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { MediaUploaderService } from '../../_services/mediaUploader/media-uploader.service';
import * as _ from 'lodash';
import {MdDialog} from '@angular/material';
import {WorkshopContentOnlineComponent} from '../workshop-content-online/workshop-content-online.component';
import {WorkshopContentProjectComponent} from '../workshop-content-project/workshop-content-project.component';
import {WorkshopContentVideoComponent} from '../workshop-content-video/workshop-content-video.component';
import {CollectionService} from '../../_services/collection/collection.service';

declare var moment: any;

@Component({
  selector: 'app-itenary',
  templateUrl: 'content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  // we will pass in address from App component
  @Input()
  public itenaryForm: FormGroup;
  @Input()
  public itenaryId: Number;
    @Input()
    public collectionStartDate: any;
    @Input()
    public collectionEndDate: any;

  @Output()
  triggerSave: EventEmitter<any> = new EventEmitter<any>();

  public tempForm: FormGroup;
  public modal: ModalModule;
  public lastIndex: number;
  public dontAllow: true;
  public editIndex: number;
  public countries: any[];
  public filesToUpload: number;
  public filesUploaded: number;

  constructor(
    private _fb: FormBuilder,
    private http: Http,
    public config: AppConfig,
    private countryPickerService: CountryPickerService,
    private mediaUploader: MediaUploaderService,
    private dialog: MdDialog,
    public _collectionService: CollectionService
  ) {
      this.countryPickerService.getCountries()
        .subscribe((countries) => this.countries = countries);
      console.log('start date: ' + typeof(this.collectionStartDate) + ' : ' + this.collectionStartDate);
      console.log('end date'  + typeof(this.collectionEndDate) + ' : ' + this.collectionEndDate);
  }

  ngOnInit() {
    const content = <FormArray>this.itenaryForm.controls.contents;
    this.lastIndex = content.controls.length - 1;
      console.log('start date: ' + typeof(this.collectionStartDate) + ' : ' + this.collectionStartDate);
      console.log('end date'  + typeof(this.collectionEndDate) + ' : ' + this.collectionEndDate);
  }

  addContent(contentType: string) {
    console.log('Adding Content');
    const contentArray = <FormArray>this.itenaryForm.controls['contents'];
    const contentObject = this.initContent();
    contentObject.controls.type.patchValue(contentType);
    contentObject.controls.pending.patchValue(true);
    contentArray.push(contentObject);
    console.log(contentObject);
    this.addIndex();
  }

  initContent() {
    return this._fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(10)]],
      type: [''],
      description: [''],
      supplementUrls: this._fb.array([]),
      requireRSVP: [''],
      itemsProvided: this._fb.array([]),
      notes: [''],
      imageUrl: [''],
      prerequisites: [''],
      schedule: this._fb.group({
        startDay: [''],
        endDay: [''],
        startTime: [''],
        endTime: ['']
      }),
      pending: ['']
    });
  }

  removeContentForm(i: number) {
    console.log('Discarding Form Content');
    const control = <FormArray>this.itenaryForm.controls['contents'];
    control.removeAt(i);
    this.resetIndex();
    this.resetProgressBar();
  }

  removeContent(i: number) {
    console.log('Discarding Content from database');
    this.triggerSave.emit({
      action: 'delete',
      value: i
    });
    console.log('removed!');
    this.resetProgressBar();
    this.resetIndex();
  }
  addIndex() {
    this.lastIndex++;
  }

  resetIndex() {
    this.lastIndex--;
  }

  imageUploadNew(event) {
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        contentForm.controls['imageUrl'].patchValue(responseObj.url);
      }).subscribe();
    }// data => console.log('response', data)
  }

  imageUploadUpdate(event) {
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.editIndex];
        contentForm.controls['imageUrl'].patchValue(responseObj.url);
      }).subscribe();
    }
  }


  saveTempForEditDate(content, index) {

    const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
    const contentForm = <FormGroup>contentsFArray.controls[index];
    contentForm.patchValue(content);
    this.triggerSave.emit({
      action: 'update',
      value: index
    });
    console.log('updated!');
    this.resetProgressBar();

  }

  saveContent(lastIndex) {
    this.triggerSave.emit({
      action: 'add',
      value: lastIndex
    });
    console.log('saved!');
    this.resetProgressBar();
  }

  resetProgressBar() {
    delete this.filesToUpload;
    delete this.filesUploaded;
  }

  editContent(index) {
      /*const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
      const contentForm = <FormGroup>contentsFArray.controls[index];
      contentForm.patchValue(this.tempForm.value);*/
      this.triggerSave.emit({
          action: 'update',
          value: index
      });
      console.log('updated!');
      this.resetProgressBar();
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

  uploadEdit(event) {
    this.filesToUpload = event.files.length;
    this.filesUploaded = 0;
    for (const file of event.files) {
      this.mediaUploader.upload(file).map((responseObj: Response) => {
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.editIndex];
        const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
        supplementUrls.reset();
        supplementUrls.push(this._fb.control(responseObj.url));
      })
        .subscribe();
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

  resetEditUrls(event) {
    const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
    const contentForm = <FormGroup>contentsFArray.controls[this.editIndex];
    const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
    supplementUrls.reset();
    this.resetProgressBar();
  }

  itemNewRemoved(event) {
    delete this.filesToUpload;
    this.filesUploaded = 0;
  }

  itemEditRemoved(event) {
    delete this.filesToUpload;
    this.filesUploaded = 0;
    //this.deleteFromContainer(event);
  }

  triggerContentUpdate(form) {
    const date = form.controls.date.value;
    const contentArray = <FormArray>form.controls['contents'].controls;
    for (let i = 0; i < contentArray.length; i++) {
      const type = contentArray[i].controls.type.value;
      contentArray[i].controls.schedule.controls.startDay.patchValue(date);
      contentArray[i].controls.schedule.controls.endDay.patchValue(date);
      this.saveTempForEditDate(contentArray[i], i);
    }
  }

  public showItineraryDate(date) {
    if (date) {
      return moment(date).format('DD/MM/YYYY');
    }
    else {
      return 'Select date';
    }
  }

    /**
     * Open dialog for creating new online content
     */
    public findAndOpenDialog(index) {
      let isEdit = true;
      const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
      if (index === -1) {
          index = contentsFArray.controls.length - 1;
          isEdit = false;
      }
      const contentForm = <FormGroup>contentsFArray.controls[index];
      const contentType = contentForm.value.type;
      let dialogRef: any;
      switch (contentType) {
          case 'online':
              dialogRef = this.dialog.open(WorkshopContentOnlineComponent, {data: {itenaryForm: this.itenaryForm, index: index, isEdit: isEdit}, disableClose: true, hasBackdrop: true, width: '60vw', height: '90vh'});
              break;
          case 'project':
              dialogRef = this.dialog.open(WorkshopContentProjectComponent, {data: {itenaryForm: this.itenaryForm, index: index, isEdit: isEdit}, disableClose: true, hasBackdrop: true, width: '60vw', height: '90vh'});
              break;
          case 'video':
              dialogRef = this.dialog.open(WorkshopContentVideoComponent, {data: {itenaryForm: this.itenaryForm, index: index, isEdit: isEdit}, disableClose: true, hasBackdrop: true, width: '60vw', height: '90vh'});
              break;
          default:
              break;
      }

      dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          result = JSON.parse(result);
          if (result.status === 'save') {
              this.saveContent(result.data);
          }
          else if (result.status === 'edit') {
              this.editContent(result.data);
          }
          else if (result.status === 'delete') {
              this.removeContent(result.data);
          }
          else if (result.status === 'close') {
              // do nothing
          }
          else {
              this.removeContentForm(result.data);
          }
      });
    }

    getCollectionStartDate() {
      if (this.collectionStartDate !== undefined) {
        return new Date(this.collectionStartDate);
      }
      else {
        return new Date(2000, 0 , 1);
      }
    }

    getCollectionEndDate() {
        if (this.collectionEndDate !== undefined) {
            return new Date(this.collectionEndDate);
        }
        else {
            return new Date(2020, 0 , 1);
        }
    }

}
