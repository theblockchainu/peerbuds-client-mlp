import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ProfileService } from '../_services/profile/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public userId: string;
  public loading: boolean;
  constructor(
    public config: AppConfig,
    public profileService: ProfileService,
    private cookieUtilsService: CookieUtilsService,
    private activatedRoute: ActivatedRoute) {
    this.userId = cookieUtilsService.getValue('userId');
    this.loading = true;
  }

  ngOnInit() {
  }

}
