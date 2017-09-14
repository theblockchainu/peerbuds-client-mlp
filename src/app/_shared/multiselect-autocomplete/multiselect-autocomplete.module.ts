import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdIconModule } from '@angular/material';
import { MultiselectAutocomplete }   from './multiselect-autocomplete.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdIconModule
    ],
    exports: [
        MultiselectAutocomplete,
    ],
    declarations: [
        MultiselectAutocomplete,
    ],
    providers: [],
})
export class MultiselectAutocompleteModule { }



