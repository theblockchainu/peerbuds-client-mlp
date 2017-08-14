import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../app.config';

import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { ContentService } from '../_services/content/content.service';
import _ from 'lodash';

@Component({
  selector: 'onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  public userId: string;
  public placeholderStringTopic = 'Search for a topic ';
  public step = 1;
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
      //document.getElementById("#" + topic.id).checked = true;
    });
  }

  public ngOnInit() {

  }
  goToNext(e) {
    //alert(e);
    if (typeof e == "number") {
      this.step = e;
    }
    else {
      if (e.target.checked) {
        this.step = 2;
        return;
      }
    }
  }
  public submitInterests(interests) {
    let topicArray = [];
    this.interests.forEach((topic) => {

      topicArray.push(topic.id);
    });
    if (topicArray.length !== 0) {
      // this.http.put(this.config.apiUrl + '/api/peers/' + this.userId
      //   + '/topics/rel/' + topicArray)
      //   .map((response: Response) => { }).subscribe();
    }
    //this.step++;

  }
  public changeInterests(topic: any) {
    let index = this.interests.indexOf(topic);
    if (index > -1) {
      this.interests.splice(index, 1); // If the user currently uses this topic, remove it.
    } else {
      this.interests.push(topic); // Otherwise add this topic.
    }
  }
}
