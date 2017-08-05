import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { ProfileService } from '../_services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: any = {};
  public socialProfile: any = [];
  public interestTopics: any = [];
  public max = 5;
  public rate = 5;
  public isReadonly = true;

  constructor(private config: AppConfig, public profileService: ProfileService) { }

  ngOnInit() {
    this.getProfile();
    this.getSocialProfiles();
    this.getInterestTopics();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
    });
  }

  getSocialProfiles() {
    this.profileService.socialProfiles().subscribe(socialProfile => {
      this.socialProfile = socialProfile;
      this.socialProfile.forEach(thisProfile => {
        thisProfile.profile = JSON.parse(thisProfile.profile);
      });
    });
  }

  getInterestTopics() {
    this.profileService.interestTopics().subscribe(interestTopics => {
      this.interestTopics = interestTopics;
    });
  }
}
