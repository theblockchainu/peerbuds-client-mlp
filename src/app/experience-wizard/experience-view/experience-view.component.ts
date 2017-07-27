import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, } from '@angular/http';
import { AppConfig } from '../../app.config';
import { CountryPickerService } from '../../_services/countrypicker/countrypicker.service';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-experience-view',
  templateUrl: './experience-view.component.html',
  styleUrls: ['./experience-view.component.scss']
})

export class ExperienceViewComponent implements OnInit {
    // we will pass in address from App component
    @Input('group')
    public itenaryForm: FormGroup;
    @Input('itenaryId')
    public itenaryId: Number;

    public contentObject: FormGroup;

    @Output()
    triggerSave: EventEmitter<any> = new EventEmitter<any>();

    public tempForm: FormGroup;
    public modal: ModalModule;
    public lastIndex: number;
    public dontAllow: true;
    public editIndex: number;
    public countries: any[];
    constructor(
        private _fb: FormBuilder, private http: Http, private config: AppConfig,
        private countryPickerService: CountryPickerService
    ) {
        this.countryPickerService.getCountries()
            .subscribe((countries) => this.countries = countries);
    }

    ngOnInit() {
        this.contentObject = this._fb.group({
            id: [''],
            title: [''],
            type: [''],
            description: [''],
            supplementUrls: this._fb.array([
                ['']
            ]),
            requireRSVP: [''],
            itemsProvided: this._fb.array([
                ['']
            ]),
            notes: [''],
            imageUrl: [''],
            prerequisites: [''],
            schedule: this._fb.group({
                startDay: [''],
                endDay: [''],
                startTime: [''],
                endTime: ['']
            }),
            location: this._fb.group({
                location_name: [''],
                country: [''],
                street_address: [''],
                apt_suite: [''],
                city: [''],
                state: [''],
                zip: [''],
                map_lat: [''],
                map_lng: ['']
            }),
            pending: ['']
        });

        const contentArray = <FormArray>this.itenaryForm.controls['contents'];
        contentArray.push(this.contentObject);

    }



    imageUploaded(event) {
        let file = event.src;
        let fileName = event.file.name;
        let fileType = event.file.type;
        let formData = new FormData();

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
    }

    mapClicked(event) {
        const location = <FormGroup>this.contentObject.controls.location;
        location.controls.map_lat.setValue(event.lat);
        location.controls.map_lng.setValue(event.lng);
    }

    save() {
        this.triggerSave.emit({
            action: "add",
            value: 0
        });
        console.log("saved!");
    }

}
