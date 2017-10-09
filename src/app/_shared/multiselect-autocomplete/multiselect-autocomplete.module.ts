import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdIconModule } from '@angular/material';
import { MultiselectAutocomplete } from './multiselect-autocomplete.component';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdIconModule,
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.threeBounce,
            backdropBackgroundColour: 'rgba(0,0,0,0)',
            backdropBorderRadius: '0px',
            primaryColour: '#33bd9e',
            secondaryColour: '#ff5b5f',
            tertiaryColour: '#ff6d71'
        })
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



