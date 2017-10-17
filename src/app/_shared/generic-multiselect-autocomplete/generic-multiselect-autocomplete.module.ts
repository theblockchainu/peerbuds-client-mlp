import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GenericMultiselectAutocomplete }   from './generic-multiselect-autocomplete.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [
        GenericMultiselectAutocomplete,
    ],
    declarations: [
        GenericMultiselectAutocomplete,
    ],
    providers: [],
})
export class GenericMultiselectAutocompleteModule { }