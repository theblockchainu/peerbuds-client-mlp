import { Component, OnInit, Input, forwardRef, ElementRef, Inject, EventEmitter
  , HostBinding, HostListener, Output} from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR
  , NG_VALIDATORS, Validator} from '@angular/forms';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
, RequestOptionsArgs } from '@angular/http';
import {Observable} from 'rxjs';

import { RequestHeaderService } from '../../requestHeader/request-header.service';

import _ from 'lodash';

@Component({
selector: 'app-multiselect-topic-dialog',
providers: [
{
provide: NG_VALUE_ACCESSOR,
useExisting: forwardRef(() => MultiselectTopicDialogComponent),
multi: true,
},
{
provide: NG_VALIDATORS,
useExisting: forwardRef(() => MultiselectTopicDialogComponent),
multi: true,
}],
styleUrls: [ './multiselect-topic-dialog.component.scss' ],
templateUrl: './multiselect-topic-dialog.component.html'
})
export class MultiselectTopicDialogComponent implements OnInit{ //implements ControlValueAccessor
public query = '';
public selected = [];
public removed = [];
public filteredList = [];
public elementRef;
private options;
public placeholderString;
public entryInSelected = undefined;
public selectedQueries = [];
public maxTopicMsg;
public loadingSuggestions = false;
// Input parameter - jsonObject of collection
@Input('list')
private inputCollection: any = {};

// Optional Input Parameter
@Input('searchUrl')
public searchURL: string = '';

// Optional Input Parameter
@Input('multiSelect')
private isMultiSelect: boolean = true;

@Input('create')
private canCreate: boolean = false;

@Input('createURL')
private postURL:string = '';

@Input('title')
public title:string =  '';

@Input('preSelectedTopics')
private preselectedTopics:any = [];

@Input('minSelection')
private minSelection: number = -1;

@Input('maxSelection')
private maxSelection: number = -1;

@Output()
selectedOutput = new EventEmitter<any>();

@Output()
removedOutput = new EventEmitter<any>();

@Output()
anyItemNotFound = new EventEmitter<any>();

@Output()
queries = new EventEmitter<any>(); 

@Output()
active = new EventEmitter<any>();

constructor(myElement: ElementRef,
        private http: Http,
        public requestHeaderService: RequestHeaderService,
        public dialogRef: MdDialogRef<MultiselectTopicDialogComponent>,
        @Inject(MD_DIALOG_DATA) public data: any
      ) {
  this.elementRef = myElement;
  this.options = requestHeaderService.getOptions(); 
  this.placeholderString = this.title;
}

ngOnInit() {
  if(this.data) {
    this.searchURL = this.data.searchUrl;
    this.dialogRef.backdropClick().subscribe(() => {
      this.sendDataToCaller();
    });
  }
}

sendDataToCaller() {
  this.data.selected = this.selected;
  this.dialogRef.close(this.data);
}

@HostListener('document:click', ['$event'])
  private handleClick(event) {
  let clickedComponent = event.target;
  let inside = false;
  do {
    if (clickedComponent === this.elementRef.nativeElement) {
    inside = true;
    }
    clickedComponent = clickedComponent.parentNode;
  } while (clickedComponent);
  if (!inside) {
    this.filteredList = [];

  }
}

ngOnChanges() {
if(!!this.preselectedTopics){       
  console.log(this.preselectedTopics);         
}
this.selected = _.union(this.preselectedTopics, this.selected);
}

ngViewInitChanges() {
this.selected = _.union(this.preselectedTopics, this.selected);
console.log(this.selected);
}

public filter() {
this.loadingSuggestions = true;
let showItemNotFound = true;
if (!this.isMultiSelect) {
if (this.filteredList.length !== 0) {
  //Force only 1 selection
  //TBD
}
}
if (this.query !== '') {
this.active.emit(true);
let query = _.find(this.selectedQueries, 
    (entry) => { 
      return entry == this.query; 
    });
if(!query) {
  this.selectedQueries.push(this.query);
}
if (Object.keys(this.inputCollection).length !== 0 && this.inputCollection.constructor === Object) {
    this.filteredList = _.filter(this.inputCollection, (item) => {
          return item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
    });
    this.emitRequestTopic();
}
if (this.searchURL) {
    let finalSearchURL = this.searchURL + this.query;
    this.http.get(finalSearchURL) 
             .map(res => { 
              this.loadingSuggestions = false;
              this.filteredList = [];
              res.json().map(item => { 
                this.entryInSelected = _.find(this.selected, function(entry) { return entry.id == item.id; });
                if(!this.entryInSelected) {
                  showItemNotFound = true;
                }
                else {
                  showItemNotFound = false;
                }

                let obj = {};
                obj['id'] = item.id;
                obj['name'] = item.name;
                obj['type'] = item.type;
                obj['createdAt'] = item.createdAt;
                obj['updatedAt'] = item.updatedAt;
                obj['inSelect'] = !!this.entryInSelected;
                this.filteredList.push(obj);
              });
              if(showItemNotFound) {
                this.emitRequestTopic();
              }
              // if(this.filteredList.length === 0 && this.canCreate)
              // {
              //   //Post the new item into the respective collection
              //   const body = {
              //     'name' : this.query,
              //     'type': 'user'
              //   };
              //   this.http.post(this.postURL, body, this.options)
              //             .map((res: Response) => {
              //               this.select(res.json());
              //             })
              //             .subscribe();
              // }
            })
            .subscribe();
}
} else {
this.active.emit(false);
this.filteredList = [];
this.anyItemNotFound.emit('');
this.selectedOutput.emit(this.selected);
}
}

private emitRequestTopic() {
  if(this.filteredList.length == 0) {
    this.anyItemNotFound.emit(this.query);
  }
  else {
  this.anyItemNotFound.emit('');
  }
}

private select(item) {
  let itemPresent = _.find(this.selected, function(entry) { return item.id == entry.id; });
  if (itemPresent) {
  this.selected = _.remove(this.selected, function(entry) {return item.id != entry.id;});
  this.removedOutput.emit(this.removed);
  }
  else {
    if (this.selected.length >= this.maxSelection && this.maxSelection != -1)
    {
      this.query = '';
      this.filteredList = [];
      this.maxTopicMsg = 'You cannot select more than 3 topics. Please delete any existing one and then try to add.';
      return;
    }
    if (this.preselectedTopics.length != 0){
      this.selected = _.union(this.preselectedTopics, this.selected);
    }
    this.selected.push(item);
  }
  this.selectedOutput.emit(this.selected);
  this.queries.emit(this.selectedQueries);
  this.query = '';
  this.filteredList = [];
}

private remove(item) {
  this.selected.splice( this.selected.indexOf(item), 1);
  this.removed.push(item);
  this.selectedOutput.emit(this.selected);
  this.removedOutput.emit(this.removed);
}

}

