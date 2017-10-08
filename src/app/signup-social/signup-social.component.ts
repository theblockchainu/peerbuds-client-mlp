import { Component, OnInit } from '@angular/core';
import {
  Http, Headers, Response, BaseRequestOptions, RequestOptions
  , RequestOptionsArgs
} from '@angular/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { ProfileService } from '../_services/profile/profile.service';
import 'rxjs/add/operator/map';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-signup-social',
  templateUrl: './signup-social.component.html',
  styleUrls: ['./signup-social.component.scss']
})
export class SignupSocialComponent implements OnInit {

  public peerProfile: any = {};
  public presentYear: any = new Date().getFullYear();
  public maxYear = this.presentYear;
  public periodStarts = (this.presentYear - 100);
  public period = 100;
  public birthYear: any = [];
  public birthDay: any = [];
  public promoOptIn = false;
  public signupSocialForm: FormGroup;
  public selectedDay;
  public selectedMonth;
  public selectedYear;
  public dob: string;

  constructor(public profileService: ProfileService, private _fb: FormBuilder, public router: Router) { }

  ngOnInit() {
    this.getPeerWithProfile();
    this.loadMonthAndYear();

    this.signupSocialForm = this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['',
        [Validators.required,
        Validators.pattern(EMAIL_REGEX)]],
      birthMonth: [null, [Validators.required]],
      birthDay: [null, [Validators.required]],
      birthYear: [null, [Validators.required]]
      // promoOptIn: 'false',
    });
  }

  getPeerWithProfile() {
    const query = {};
    this.profileService.getProfileData(query).subscribe((peerProfile) => {
      this.peerProfile = peerProfile[0];

      this.signupSocialForm.controls.first_name.patchValue(peerProfile[0].first_name);
      this.signupSocialForm.controls.last_name.patchValue(peerProfile[0].last_name);
      if(peerProfile[0].email) {
        this.signupSocialForm.controls.email.patchValue(peerProfile[0].email);
      }
    });
  }

  // Load month and year
  loadMonthAndYear() {
    for (let index = this.maxYear; index >= this.periodStarts; index--) {
      // var element = array[index];
      this.birthYear.push(index);
    }

    for (let index = 1; index <= 31; index++) {
      // var element = array[index];
      this.birthDay.push(index);
    }
  }

  continueWithSocialSignup(signupSocialForm) {
    debugger;
    console.log(this.signupSocialForm.value);
    const email = { email: this.signupSocialForm.value.email };
    const profile = {
      first_name: this.signupSocialForm.value.first_name,
      last_name: this.signupSocialForm.value.last_name,
      birthMonth: this.signupSocialForm.value.birthMonth,
      birthDay: this.signupSocialForm.value.birthDay,
      birthYear: this.signupSocialForm.value.birthYear
    };

    this.profileService.updatePeer(email).subscribe();
    this.profileService.updatePeerProfile((this.peerProfile.id), profile).subscribe((response: Response) => response.json());

    this.router.navigate(['app-upload-docs', '1']);

  }

}
