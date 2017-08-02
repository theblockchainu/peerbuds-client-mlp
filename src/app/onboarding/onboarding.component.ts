import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../app.config';

@Component({
  selector: 'onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  public userId: string;
  public placeholderStringTopic = 'Search for a topic or enter a new one';
  public step = 1;
  public learnerType_array = {
    learner_type: [{ id: 'auditory', display: 'Auditory' }
      , { id: 'visual', display: 'Visual' }
      , { id: 'read-write', display: 'Read & Write' }
      , { id: 'kinesthetic', display: 'Kinesthetic' }]
  };
  public suggestedTopics = [];
  public interests = [];
  public interest1: FormGroup;

  constructor(
    private http: Http, private config: AppConfig,
    private _fb: FormBuilder
  ) {
    this.interest1 = new FormGroup({

    });
  }
  
  public ngOnInit() {

  }
  goToNext(e){
    //alert(e);
    if(typeof e=="number"){
      this.step = e;
    }
    else{
        if(e.target.checked){
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
