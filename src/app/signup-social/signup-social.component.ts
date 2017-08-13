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
      first_name: '',
      last_name: '',
      email: '',
      birthMonth: [null, [Validators.required]],
      birthDay: [null, [Validators.required]],
      birthYear: [null, [Validators.required]],
      promoOptIn: 'false',
    });
  }

  getPeerWithProfile() {
    this.profileService.getPeerProfile().subscribe(peerProfile => {
      this.peerProfile = peerProfile;
      // this.peerProfile.identities.forEach(identity => {
      //   identity.profile = JSON.parse(identity.profile);
      // });
      console.log('Peer Profile: ' + JSON.stringify(peerProfile));

      this.signupSocialForm.controls.first_name.patchValue(peerProfile.profiles[0].first_name);
      this.signupSocialForm.controls.last_name.patchValue(peerProfile.profiles[0].last_name);
      this.signupSocialForm.controls.email.patchValue(peerProfile.email);
    });
  }

  // Load month and year
  loadMonthAndYear() {
    for (let index = this.periodStarts; index <= this.maxYear; index++) {
      // var element = array[index];
      this.birthYear.push(index);
    }

    for (let index = 1; index <= 31; index++) {
      // var element = array[index];
      this.birthDay.push(index);
    }
  }

  continueWithSocialSignup() {
    console.log(this.signupSocialForm.value);
    const email = {email: this.signupSocialForm.value.email};
    this.dob = this.selectedYear + '-' + this.selectedMonth + '-' + this.selectedDay;
    const profile = {
      first_name: this.peerProfile.profiles[0].first_name,
      last_name: this.peerProfile.profiles[0].last_name,
      dob: this.dob,
      promoOptIn: this.promoOptIn
    };

    this.profileService.updatePeer((this.peerProfile.id), email).subscribe((response: Response) => response.json());
    this.profileService.updatePeerProfile((this.peerProfile.id), profile).subscribe((response: Response) => response.json());

    this.router.navigate(['identity-verification']);

  }

}
