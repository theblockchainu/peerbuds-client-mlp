import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication/authentication.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactComponent implements OnInit {
  private first_name: string;
  private last_name: string;
  private email: string;
  private subject: string;
  private message: string;
  contactUsForm: FormGroup;

  lat: number = 37.508772;
  lng: number = -121.960507;

  constructor(public _fb: FormBuilder,
    private authenticationService: AuthenticationService) {
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
public createGuestContacts() {
  // this.loading = true;
  this.first_name = this.contactUsForm.controls['first_name'].value;
  this.last_name = this.contactUsForm.controls['last_name'].value;
  this.email = this.contactUsForm.controls['email'].value;
  this.subject = this.contactUsForm.controls['subject'].value;
  this.message = this.contactUsForm.controls['message'].value;
  this.authenticationService.createGuestContacts(this.first_name, this.last_name, this.email, this.subject, this.message)
      .subscribe();
}
}
