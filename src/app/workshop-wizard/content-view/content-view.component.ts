import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { AppConfig } from '../../app.config';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { ModalModule, ModalDirective } from "ngx-bootstrap";
import * as _ from 'lodash';

@Component({
  selector: 'itenary',
  templateUrl: 'content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  // we will pass in address from App component
  @Input('group')
  public itenaryForm: FormGroup;
  @Input('itenaryId')
  public itenaryId: Number;

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
    private _fb: FormBuilder, private http: Http, private config: AppConfig,
    private countryPickerService: CountryPickerService
  ) {
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
  }

  ngOnInit() {
    const content = <FormArray>this.itenaryForm.controls.contents;
    this.lastIndex = content.controls.length - 1;
  }

  addContent(contentType: string) {
    console.log("Adding Content");
    const contentArray = <FormArray>this.itenaryForm.controls['contents'];
    var contentObject = this.initContent();
    contentObject.controls.type.setValue(contentType);
    contentObject.controls.pending.setValue(true);
    contentArray.push(contentObject);
    this.addIndex();
  }

  initContent() {
    return this._fb.group({
      id: [''],
      title: [''],
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

  removeContentForm(i: number, modal: ModalDirective) {
    console.log("Discarding Form Content");
    const control = <FormArray>this.itenaryForm.controls['contents'];
    control.removeAt(i);
    this.resetIndex();
    modal.hide();
    this.resetProgressBar();

  }

  removeContent(i: number) {
    console.log("Discarding Content from database");
    this.triggerSave.emit({
      action: "delete",
      value: i
    });
    console.log("removed!");
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
    let file = event.src;
    let fileName = event.file.name;
    let fileType = event.file.type;
    let formData = new FormData();
    console.log(event);

    formData.append('file', event.file);

    this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
      .map((response: Response) => {
        let mediaResponse = response.json();
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
        contentForm.controls['imageUrl'].setValue(mediaResponse.url);
      })
      .subscribe(); // data => console.log('response', data)
  }

  imageUploadUpdate(event) {
    let file = event.src;
    let fileName = event.file.name;
    let fileType = event.file.type;
    let formData = new FormData();
    console.log(event);

    formData.append('file', event.file);

    this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
      .map((response: Response) => {
        let mediaResponse = response.json();
        const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
        const contentForm = <FormGroup>contentsFArray.controls[this.editIndex];
        contentForm.controls['imageUrl'].setValue(mediaResponse.url);
      })
      .subscribe(); // data => console.log('response', data)
  }

  editContent(listIndex: number, onlineEditModal: ModalDirective, videoEditModal: ModalDirective, projectEditModal: ModalDirective) {
    this.editIndex = listIndex;
    const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
    const contentForm = <FormGroup>contentsFArray.controls[listIndex];
    this.tempForm = _.cloneDeep(contentForm);
    let contentType = contentForm.value.type;
    let editModal: ModalDirective;
    switch (contentType) {
      case "online":
        editModal = onlineEditModal
        break;
      case "project":
        editModal = projectEditModal;
        break;
      case "video":
        editModal = videoEditModal;
        break;
      default:
        break;
    }
    editModal.show();
    // editModal.onHide.subscribe(() => {
    // });
  }


  saveTemp(modal: ModalDirective) {
    let contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
    let contentForm = <FormGroup>contentsFArray.controls[this.editIndex];
    contentForm.setValue(this.tempForm.value);

    this.triggerSave.emit({
      action: "update",
      value: this.editIndex
    });
    modal.hide();
    console.log("updated!");
    this.resetProgressBar();

  }

  saveNew(modal: ModalDirective) {

    this.triggerSave.emit({
      action: "add",
      value: this.lastIndex
    });
    console.log("saved!");
    this.resetProgressBar();
    modal.hide();
  }

  resetProgressBar() {
    delete this.filesToUpload;
    delete this.filesUploaded;
  }

  uploadNew(event) {
    console.log(event.files);
    this.filesToUpload = event.files.length;
    this.filesUploaded = 0;
    for (let fileIndex in event.files) {
      let file = event.files[fileIndex];
      console.log(file);
      file.src = file.objectURL.changingThisBreaksApplicationSecurity;
      let formData = new FormData();
      formData.append('file', file);
      this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
        .map((response: Response) => {
          let responseObj = response.json();
          const contentsFArray = <FormArray>this.itenaryForm.controls['contents'];
          const contentForm = <FormGroup>contentsFArray.controls[this.lastIndex];
          const supplementUrls = <FormArray>contentForm.controls.supplementUrls;
          supplementUrls.reset();
          supplementUrls.push(this._fb.control(responseObj.url));
          this.filesUploaded++;
        })
        .subscribe();
    }

  }

  uploadEdit(event) {
    this.filesToUpload = event.files.length;
    this.filesUploaded = 0;
    for (let fileIndex in event.files) {
      let file = event.files[fileIndex];
      console.log(file);
      file.src = file.objectURL.changingThisBreaksApplicationSecurity;
      let formData = new FormData();
      formData.append('file', file);
      let attachments: Array<any>;
      this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData)
        .map((response: Response) => {
          let responseObj = response.json();
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
  }

}