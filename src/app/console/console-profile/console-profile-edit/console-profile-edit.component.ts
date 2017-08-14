import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsoleProfileComponent} from '../console-profile.component';
import {CookieService} from 'ngx-cookie-service';
import {ProfileService} from '../../../_services/profile/profile.service';
import {LanguagePickerService} from '../../../_services/languagepicker/languagepicker.service';
import {CurrencypickerService} from '../../../_services/currencypicker/currencypicker.service';
import {MdSnackBar} from '@angular/material';

declare var moment: any;

@Component({
  selector: 'app-console-profile-edit',
  templateUrl: './console-profile-edit.component.html',
  styleUrls: ['./console-profile-edit.component.scss']
})
export class ConsoleProfileEditComponent implements OnInit {

  public loaded: boolean;
  public profile: any;
  public months: any[];
  public days: any[];
  public years: any[];
  public languages: any[];
  public currencies: any[];

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _cookieService: CookieService,
    public _profileService: ProfileService,
    public _languageService: LanguagePickerService,
    public _currencyService: CurrencypickerService,
    public snackBar: MdSnackBar
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      if (urlSegment[0] === undefined) {
        consoleProfileComponent.setActiveTab('edit');
      } else {
        consoleProfileComponent.setActiveTab(urlSegment[0].path);
      }
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._profileService.getProfile().subscribe((profiles) => {
      this.profile = profiles[0];
      console.log(this.profile);
      this.loaded = true;
      this.months = moment.months();
      this.days = this.getDaysArray();
      this.years = this.getYearsArray();
    });
    this._languageService.getLanguages().subscribe(languages => {
      this.languages = languages;
    });
    this._currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  /**
   * Get array of days
   * @returns {Array}
   */
  public getDaysArray() {
    const days = [];
    for (let i = 0; i <= 30; i++) {
      days.push(i);
    }
    return days;
  }

  /**
   * Get array of days
   * @returns {Array}
   */
  public getYearsArray() {
    const years = [];
    for (let i = moment().year(); i >= 1917; i--) {
      years.push(i);
    }
    return years;
  }

  /**
   * Update profile of logged in user
   */
  public updateProfile() {
    const profileToUpdate = Object.assign({}, this.profile);
    this._profileService.updateProfile(profileToUpdate, (err, result) => {
      if (!err) {
        console.log(result);
        this.snackBar.open('Profile Updated', 'Close');
      } else {
        this.snackBar.open('Profile Updated', 'Retry').onAction().subscribe(() =>{
          this.updateProfile();
        });
      }
    });
  }

}
