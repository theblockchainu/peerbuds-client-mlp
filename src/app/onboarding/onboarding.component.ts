import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import {
  URLSearchParams, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs
} from '@angular/http';
import { Http } from '@angular/http';
import { AppConfig } from '../app.config';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { ContentService } from '../_services/content/content.service';
import { ProfileService } from '../_services/profile/profile.service';
import { TopicService } from '../_services/topic/topic.service';

import _ from 'lodash';

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

  public socialIdentitiesConnected: any = [];
  public boolShowConnectedSocials = false;
  private connectedIdentities = {
    'fb': false,
    'google': false
  };

  public maxTopicMsg = 'Choose max 3 related topics';
  public maxTopics = 3;
  public removedInterests = [];
  public relTopics = [];
  public showRequestNewTopic = false;
  public topicForRequest = '';

  constructor(
    private http: Http, private config: AppConfig,
    private _fb: FormBuilder,
    private countryPickerService: CountryPickerService,
    private _contentService: ContentService,
    private _profileService: ProfileService,
    private _topicService: TopicService
  ) {
    this.step = 1;
    this.interest1 = new FormGroup({
    });
    this.countryPickerService.getCountries()
      .subscribe((countries) => this.countries = countries);
    this._contentService.getTopics()
      .subscribe((suggestions) => this.suggestedTopics = suggestions);
    this.userId = _profileService.getUserId();
    
    this._profileService.getSocialIdentities()
    .subscribe((response: Response) => {
      this.socialIdentitiesConnected = response;

      this.socialIdentitiesConnected.forEach(socialIdentity => {
        if (socialIdentity.provider === 'google') {
          this.connectedIdentities.google = true;
        }
        if (socialIdentity.provider === 'facebook') {
          this.connectedIdentities.fb = true;
        }
      });
      // console.log(JSON.stringify(this.socialIdentitiesConnected));

    },
    (err) => {
      console.log('Error: ' + err);
    });
  }

  public selected(event) {
    // if (this.interests.length >= 3) {
    //   this.maxTopicMsg = 'You cannot select more than 3 topics. Please delete any existing one and then try to add.';
    // }
    this.interests = event;
    this.suggestedTopics = event;
    this.suggestedTopics.map((obj) => {
      obj.checked = 'true';
      return obj;
    });
  }

  public requestNewTopicEnabled(event) {
    if(event !== '') {
      this.showRequestNewTopic = true;
      this.topicForRequest = event;
    }
    else {
      this.showRequestNewTopic = false;
      this.topicForRequest = event;
    }
  }

  public removed(event) {
    let body = {};
    let options;
    this.removedInterests = event;
    if (this.removedInterests.length !== 0) {
      const topicArray = [];
      this.removedInterests.forEach((topic) => {
        topicArray.push(topic.id);
      });

      body = {
        'targetIds': topicArray
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      options = new RequestOptions({
        headers: headers,
        body: body
      })
      console.log(body);
      console.log(topicArray);
      if (topicArray.length !== 0) {
        this.http.delete(this.config.apiUrl + '/api/collections/' + this.userId + '/topics/rel', body)
          .subscribe((response) => { console.log(response); });
      }
    }
  }

  public ngOnInit() {
    // if (this.interests.length == 0) {
    //   this.http.get(this.config.searchUrl + '/api/search/topics')
    //     .map((response: any) => {
    //       this.suggestedTopics = response.json().slice(0, 10);
    //     }).subscribe();
    // }
    // else {
    //   this.suggestedTopics = this.interests;
    // }
  }

  goToNext(n) {
    this.step = n;
  }

  public showConnectedSocials() {
    this.boolShowConnectedSocials = true;
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

  public requestNewTopic(topic: string) {
    this._topicService.requestNewTopic(topic).subscribe((res)=> {
      console.log(res);
    })
  }
}
