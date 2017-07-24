import { Component, Input, forwardRef, ElementRef, Inject, EventEmitter
        , HostBinding, HostListener, Output} from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR
        , NG_VALIDATORS, Validator} from '@angular/forms';
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
    styleUrls: [ './component.scss' ],
    templateUrl: './component.html'
})
export class MultiselectAutocomplete {
  public query = '';
  public selected = [];
  public filteredList = [];
  public elementRef;

  // Input parameter - jsonobject of collection
  @Input('list')
  private inputCollection: any = {};

  @Input('placeholder')
  private placeholderString: string = '';

  @Output()
  selectedOutput: EventEmitter<[]> = new EventEmitter<[]>();

  constructor(myElement: ElementRef) {
      this.elementRef = myElement;
      this.query = this.placeHolderString;
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
    if (this.query !== '') {
      // this.filteredList = this.countries.filter( (el) =>
      // return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1; );
      console.log(this.placeholderString == '');
      if (this.placeholderString != '') {
        this.filteredList = _.map(_.filter(this.inputCollection, (item) => {
            return item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
          }), 'name');
      }
      else {
        this.filteredList = _.map(_.filter(this.inputCollection, (item) => {
              return item.referenceName.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }), 'referenceName');
      }
    } else {
      this.filteredList = [];
    }
  }

  private select(item) {
    this.selected.push(item);
    this.selectedOutput.emit(this.selected);
    this.query = '';
    this.filteredList = [];
  }

  private remove(item) {
    this.selected.splice( this.selected.indexOf(item), 1);
    this.selectedOutput.emit(this.selected);
  }

}
