import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactComponent implements OnInit {
  contactUsForm: FormGroup;
  lat: number = 37.508772;
  lng: number = -121.960507;

  constructor(public _fb: FormBuilder){
    }

  ngOnInit() {
    this.contactUsForm = this._fb.group(
      {
        first_name: ['', Validators.requiredTrue],
        last_name: ['', Validators.requiredTrue],
        email: ['', Validators.requiredTrue],
        subject: ['', Validators.requiredTrue],
        message: ['', Validators.requiredTrue]
      }
    );
}
}
