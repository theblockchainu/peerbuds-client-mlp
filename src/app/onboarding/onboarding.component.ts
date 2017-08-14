import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../app.config';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { ContentService } from '../_services/content/content.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  public userId: string;
  public placeholderStringTopic = 'Search for a topic ';
  public step: number;
  public suggestedTopics = [];
  public interests = [];
  public interest1: FormGroup;
  public countries: any[];
  public searchTopicURL = 'http://localhost:4000/api/search/topics/suggest?field=name&query=';
  public createTopicURL = 'http://localhost:3000/api/topics';

  constructor(
    private http: Http, private config: AppConfig,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    private _contentService: ContentService
  ) {
    this.step = 1;
    this.interest1 = new FormGroup({
    });
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
    this._contentService.getTopics()
      .subscribe((suggestions) => this.suggestedTopics = suggestions);
  }

  public selected(event) {
    this.interests = event;
    this.interests.forEach((topic) => {
      /*let selected = _.filter(this.suggestedTopics, (item) => {
                return item.id = topic.id;
          });*/
      // document.getElementById("#" + topic.id).checked = true;
    });
  }

  public ngOnInit() {

  }
  goToNext(e) {
    if (typeof e !== 'number') {
      if (e.target.checked) {
        this.step = 2;
        return;
      }
    } else {
      this.step = e;
    }
  }
  public submitInterests(interests) {
    const topicArray = [];
    this.interests.forEach((topic) => {

      topicArray.push(topic.id);
    });
    if (topicArray.length !== 0) {
    }

  }
  public changeInterests(topic: any) {
    const index = this.interests.indexOf(topic);
    if (index > -1) {
      this.interests.splice(index, 1); // If the user currently uses this topic, remove it.
    } else {
      this.interests.push(topic); // Otherwise add this topic.
    }
  }
}
