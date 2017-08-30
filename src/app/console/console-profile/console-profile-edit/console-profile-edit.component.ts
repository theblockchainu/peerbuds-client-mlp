import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  styleUrls: ['./console-profile-edit.component.scss', '../../console.component.scss']
})
export class ConsoleProfileEditComponent implements OnInit {

  public loaded: boolean;
  public profile: any;
  public peer: any;
  public work: any;
  public education: any;
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
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
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
      if (this.profile.work !== undefined && this.profile.work.length === 0) {
        const workEntry = {};
        this.profile.work.push(workEntry);
      }
      if (this.profile.education !== undefined && this.profile.education.length === 0) {
        const educationEntry = {};
        this.profile.education.push(educationEntry);
      }
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
    for (let i = 1; i <= 30; i++) {
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
    const peerToUpdate = Object.assign({}, this.profile.peer[0]);
    const worksToUpdate = Object.assign([], this.profile.work);
    const educationsToUpdate = Object.assign([], this.profile.education);
    console.log(worksToUpdate);
    console.log(educationsToUpdate);
    this._profileService.updateProfile(profileToUpdate, (err, result) => {
      if (!err) {
        console.log(result);
        this.snackBar.open('Profile Updated', 'Close');
      } else {
        this.snackBar.open('Profile Update Failed', 'Retry').onAction().subscribe(() => {
          this.updateProfile();
        });
      }
    });
    this._profileService.updatePeer(peerToUpdate.id, peerToUpdate).subscribe();
    if (worksToUpdate[0].position !== undefined) {
      this._profileService.deleteProfileWorks(this.profile.id, (err, result) => {
        if (!err) {
          this._profileService.updateProfileWorks(this.profile.id, worksToUpdate, (err1, result1) => {
            if (!err1) {
              console.log(result1);
            } else {
              console.log(err1);
            }
          });
        }
      });
    }
    if (educationsToUpdate[0].degree !== undefined) {
      this._profileService.deleteProfileEducations(this.profile.id, (err, result) => {
        if (!err) {
          this._profileService.updateProfileEducations(this.profile.id, educationsToUpdate, (err1, result1) => {
            if (!err1) {
              console.log(result1);
            } else {
              console.log(err1);
            }
          });
        }
      });
    }
  }

  /**
   * Add a row to the work detail section
   */
  public addWorkDetailsRow() {
    const workEntry = {};
    this.profile.work.push(workEntry);
  }

  /**
   * Add a row to the education detail section
   */
  public addEducationDetailsRow() {
    const eduEntry = {};
    this.profile.education.push(eduEntry);
  }

  /**
   * output debug data
   */
  public debugData() {
    console.log(this.profile);
  }

  trackByFn(index) {
    return index;
  }

  public deleteWorkDetailsRow(i) {
    this.profile.work.splice(i, 1);
  }

  public deleteEducationDetailsRow(i) {
    this.profile.education.splice(i, 1);
  }

}
