import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../../_services/profile/profile.service';
import { LanguagePickerService } from '../../../_services/languagepicker/languagepicker.service';
import { CurrencypickerService } from '../../../_services/currencypicker/currencypicker.service';
import { TimezonePickerService } from '../../../_services/timezone-picker/timezone-picker.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

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
  public timezones: any[];
  public profileForm: FormGroup;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _cookieService: CookieService,
    public _profileService: ProfileService,
    public _languageService: LanguagePickerService,
    public _currencyService: CurrencypickerService,
    public snackBar: MatSnackBar,
    public _fb: FormBuilder,
    public _timezoneService: TimezonePickerService) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      if (urlSegment[0] === undefined) {
        consoleProfileComponent.setActiveTab('edit');
      } else {
        consoleProfileComponent.setActiveTab(urlSegment[0].path);
      }
    });
  }

  ngOnInit() {
    this.profileForm = this._fb.group(
      {
        first_name: ['', Validators.requiredTrue],
        last_name: '',
        headline: '',
        preferred_language: '',
        other_languages: this._fb.array(['']),
        currency: '',
        gender: '',
        timezone: '',
        dobMonth: '',
        dobYear: '',
        dobDay: '',
        location_string: '',
        portfolio_url: '',
        description: '',
        phones: this._fb.array(['']),
        vat_number: '',
        emergency_contact: this._fb.array(['']),
        education: this._fb.array([
          this.initializeEducationForm()
        ]),
        work: this._fb.array([
          this.initailizeWorkForm()
        ]),
        email: '',
        isAdmin: ''
      }
    );
    const query = {
      'include': [
        'education',
        'work',
        'peer'
      ]
    };
    this._profileService.getProfileData(query).subscribe((profiles) => {
      this.setFormValues(profiles);
    });


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
    this._timezoneService.getTimezones().subscribe(timezones => {
      this.timezones = timezones;
    });
  }

  private setFormValues(profiles: Array<any>) {
    if (profiles.length > 0) {
      this.profileForm.patchValue(profiles[0]);
      this.profileForm.controls['isAdmin'].patchValue(profiles[0].peer[0].isAdmin);
      this.profileForm.controls['email'].patchValue(profiles[0].peer[0].email);
      if (profiles[0].phones && profiles[0].phones.length > 0) {
        this.profileForm.setControl('phones', this._fb.array(
          profiles[0].phones
        ));
      }
      if (profiles[0].other_languages && profiles[0].other_languages.length > 0) {
        this.profileForm.setControl('other_languages', this._fb.array(
          profiles[0].other_languages
        ));
      }
      if (profiles[0].emergency_contact && profiles[0].emergency_contact.length > 0) {
        this.profileForm.setControl('emergency_contact', this._fb.array(
          profiles[0].emergency_contact
        ));
      }
      if (profiles[0].phone && profiles[0].phones.length > 0) {
        this.profileForm.setControl('phones', this._fb.array(
          profiles[0].phones
        ));
      }
      if (profiles[0].work && profiles[0].work.length > 0) {
        this.profileForm.setControl('work', this._fb.array([]));
        const workArray = <FormArray>this.profileForm.controls['work'];
        profiles[0].work.forEach(workObj => {
          workArray.push(
            this._fb.group({
              position: [workObj.position, Validators.requiredTrue],
              company: [workObj.company, Validators.requiredTrue],
              startDate: [moment(workObj.startDate).local().toDate(), Validators.requiredTrue],
              endDate: [moment(workObj.endDate).local().toDate(), Validators.requiredTrue]
            })
          );
        });
      }
      if (profiles[0].education && profiles[0].education.length > 0) {
        this.profileForm.setControl('education', this._fb.array([]));
        const educationArray = <FormArray>this.profileForm.controls['education'];
        profiles[0].education.forEach(educationObj => {
          educationArray.push(
            this._fb.group({
              degree: educationObj.degree,
              school: educationObj.school,
              startYear: parseInt(educationObj.startYear, 10),
              endYear: parseInt(educationObj.endYear, 10),
            })
          );
        });
      }
    }
  }



  private initailizeWorkForm(): FormGroup {
    return this._fb.group({
      position: ['', Validators.requiredTrue],
      company: ['', Validators.requiredTrue],
      startDate: [null, Validators.requiredTrue],
      endDate: [null, Validators.requiredTrue]
    });
  }

  private initializeEducationForm(): FormGroup {
    return this._fb.group({
      degree: '',
      school: '',
      startYear: '',
      endYear: '',
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
   * saveProfile
   */
  public saveProfile() {
    const profileData = this.profileForm.value;
    const education = profileData.education;
    delete profileData.education;
    const work = profileData.work;
    delete profileData.work;
    const email = profileData.email;
    delete profileData.email;
    const isAdmin = profileData.isAdmin;
    delete profileData.is_Admin;
    this._profileService.updateProfile(profileData)
      .flatMap((response) => {
        return this._profileService.updateWork(this.profile.id, work);
      }).flatMap((response) => {
        return this._profileService.updateEducation(this.profile.id, education);
      }).flatMap((response) => {
        return this._profileService.updatePeer({ 'email': email, 'isAdmin': isAdmin });
      }).subscribe((response) => {
        this.snackBar.open('Profile Updated', 'Close');
      }, (err) => {
        console.log('Error updating Peer: ');
        console.log(err);
        this.snackBar.open('Profile Update Failed', 'Retry').onAction().subscribe(() => {
          this.saveProfile();
        });
      });
  }

  /**
   * deletework
index:number   */
  public deletework(index: number) {
    const work = <FormArray>this.profileForm.controls['work'];
    work.removeAt(index);
  }

  /**
   * addwork
   */
  public addwork() {
    const work = <FormArray>this.profileForm.controls['work'];
    work.push(
      this.initailizeWorkForm()
    );
  }

  /**
   * deleteeducation(index)  */
  public deleteeducation(index: number) {
    const education = <FormArray>this.profileForm.controls['education'];
    education.removeAt(index);
  }

  /**
   * name
   */
  public addeducation() {
    const education = <FormArray>this.profileForm.controls['education'];
    education.push(
      this.initializeEducationForm()
    );
  }

  /**
   * addPhoneControl
   */
  public addPhoneControl() {
    const phones = <FormArray>this.profileForm.controls['phones'];
    phones.push(this._fb.control(['']));
  }

  /**
   * deletePhoneNumber
index:number   */
  public deletePhoneNumber(index: number) {
    const phones = <FormArray>this.profileForm.controls['phones'];
    phones.removeAt(index);
  }

  /**
   * deleteLanguage
index:number   */
  public deleteLanguage(index: number) {
    const other_languages = <FormArray>this.profileForm.controls['other_languages'];
    other_languages.removeAt(index);
  }

  /**
   * addlanguage
   */
  public addlanguage() {
    const other_languages = <FormArray>this.profileForm.controls['other_languages'];
    other_languages.push(this._fb.control(['']));
  }

  /**
   * deleteEmergencyContact
   */
  public deleteEmergencyContact(index: number) {
    const emergency_contact = <FormArray>this.profileForm.controls['emergency_contact'];
    emergency_contact.removeAt(index);
  }

  /**
   * addEmergencyContact
   */
  public addEmergencyContact() {
    const emergency_contact = <FormArray>this.profileForm.controls['emergency_contact'];
    emergency_contact.push(this._fb.control(['']));
  }

}
