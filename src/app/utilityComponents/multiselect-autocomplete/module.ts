import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MultiselectAutocomplete }   from './component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
