import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsoleProfileComponent} from '../console-profile.component';
import {ProfileService} from '../../../_services/profile/profile.service';

@Component({
  selector: 'app-console-profile-verification',
  templateUrl: './console-profile-verification.component.html',
  styleUrls: ['./console-profile-verification.component.scss']
})
export class ConsoleProfileVerificationComponent implements OnInit {

  public loaded: boolean;
  public profile: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _profileService: ProfileService,
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._profileService.getProfile().subscribe((profiles) => {
      this.profile = profiles[0];
      console.log(this.profile);
      this.loaded = true;
    });
  }

}
