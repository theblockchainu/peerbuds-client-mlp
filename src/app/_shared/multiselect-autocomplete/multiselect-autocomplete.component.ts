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
    selector: 'multiselect-autocomplete',
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectAutocomplete),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiselectAutocomplete),
      multi: true,
    }],
    styleUrls: [ './multiselect-autocomplete.component.scss' ],
    templateUrl: './multiselect-autocomplete.component.html'
})
export class MultiselectAutocomplete {
  public query = '';
  public selected = [];
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

  @Output()
  selectedOutput = new EventEmitter<any>();

  constructor(myElement: ElementRef,
              private http: Http,
              public requestHeaderService: RequestHeaderService) {
      this.elementRef = myElement;
      this.options = requestHeaderService.getOptions(); 
      console.log(this.title);
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
    this.selected.push(item);
    this.selectedOutput.emit(this.selected);
    console.log(this.selected);
    this.query = '';
    this.filteredList = [];
  }

  private remove(item) {
    this.selected.splice( this.selected.indexOf(item), 1);
    this.selectedOutput.emit(this.selected);
  }

}
