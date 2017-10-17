import { Component, Input, forwardRef, ElementRef, Inject, EventEmitter
    , HostBinding, HostListener, Output} from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR
    , NG_VALIDATORS, Validator} from '@angular/forms';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
, RequestOptionsArgs } from '@angular/http';
import {Observable} from 'rxjs';

import { RequestHeaderService } from '../../_services/requestHeader/request-header.service';

import _ from 'lodash';

@Component({
selector: 'generic-multiselect-autocomplete',
providers: [
{
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GenericMultiselectAutocomplete),
  multi: true,
},
{
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => GenericMultiselectAutocomplete),
  multi: true,
}],
styleUrls: [ './generic-multiselect-autocomplete.component.scss' ],
templateUrl: './generic-multiselect-autocomplete.component.html'
})
export class GenericMultiselectAutocomplete { //implements ControlValueAccessor
public query = '';
public selected = [];
public removed = [];
public filteredList = [];
public elementRef;
private options;
public placeholderString;


// Input parameter - jsonObject of collection
@Input('list')
private inputCollection: any = {};

// Optional Input Parameter
@Input('searchUrl')
private searchURL: string = '';

// Optional Input Parameter
@Input('multiSelect')
private isMultiSelect: boolean = true;

@Input('create')
private canCreate: boolean = false;

@Input('createURL')
private postURL:string = '';

@Input('title')
private title:string =  '';

@Input('preSelectedItems')
private preselectedItems:any = [];

@Input('maxSelection')
private maxSelection: number = -1;

@Output()
selectedOutput = new EventEmitter<any>();

@Output()
removedOutput = new EventEmitter<any>();

constructor(myElement: ElementRef,
          private http: Http,
          public requestHeaderService: RequestHeaderService) {
  this.elementRef = myElement;
  this.options = requestHeaderService.getOptions(); 
  this.placeholderString = this.title;
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
console.log("ngChanges");
if(!!this.preselectedItems){         
    console.log(this.preselectedItems);         
}
this.preselectedItems = _.filter(this.preselectedItems, (item)=> { return item != ''});
this.preselectedItems.forEach(element => {
  this.selected.push({
    name: element
  });
});
this.selected = _.uniqBy(this.selected, 'name');
// this.selected = _.union(_.filter(this.preselectedItems, (item)=> { return item != ''}), this.selected);
}

ngViewInitChanges() {
// console.log("View");
// this.selected = _.union(this.preselectedItems, this.selected);
// console.log(this.selected);
}

private filter() {
if(!this.isMultiSelect) {
  if(this.filteredList.length != 0) {
    //Force only 1 selection
    //TBD
  }
}
if (this.query !== '') {
  if (this.inputCollection) {
      this.filteredList = _.filter(this.inputCollection, (item) => {
            return item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      });
  }
  if (this.searchURL) {
      let finalSearchURL = this.searchURL + this.query;
      this.http.get(finalSearchURL) 
               .map(res => { 
                this.filteredList = [];
                res.json().map(item => { 
                  let obj = {};
                  obj['id'] = item.id;
                  obj['name'] = item.name;
                  obj['type'] = item.type;
                  obj['createdAt'] = item.createdAt;
                  obj['updatedAt'] = item.updatedAt;
                  this.filteredList.push(obj);
                });
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
  this.filteredList = [];
}
}

private select(item) {
if(this.selected.length >= this.maxSelection && this.maxSelection != -1)
{
  this.query = '';
  this.filteredList = [];
  return;
}
// if(this.preselectedItems.length != 0){
//   this.selected = _.union(_.filter(this.preselectedItems, (item)=> { return item != ''}), this.selected);
// }
// this.preselectedItems.forEach(element => {
//   this.selected.push({
//     name: element
//   });
// });
this.selected.push(item);
this.selected = _.uniqBy(this.selected, 'name');
this.selectedOutput.emit(this.selected);
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