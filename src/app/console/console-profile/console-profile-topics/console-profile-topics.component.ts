import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { ProfileService } from '../../../_services/profile/profile.service';
import { AccordionItem } from '@angular/material';
import { MdSnackBar } from '@angular/material';

import _ from 'lodash';
@Component({
  selector: 'app-console-profile-topics',
  templateUrl: './console-profile-topics.component.html',
  styleUrls: ['./console-profile-topics.component.scss']
})
export class ConsoleProfileTopicsComponent implements OnInit {

  public loaded: boolean;
  public topicsLearning: Array<any>;
  public topicsTeaching: Array<any>;
  public searchTopicURL = 'http://localhost:4000/api/search/topics/suggest?field=name&query=';
  public placeholderStringTopic = 'Search for a topic ';
  private newTopics: Array<any>;

  @ViewChild('expansionpanelLearning') expansionpanelLearning: AccordionItem;
  @ViewChild('expansionpanelTeaching') expansionpanelTeaching: AccordionItem;


  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _profileService: ProfileService,
    public snackBar: MdSnackBar
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this.getTopics();
  }

  private getLearningTopics() {
    const querylearning = {};
    this._profileService.getLearningTopics(querylearning).subscribe((response) => {
      this.topicsLearning = response;
    }, (err) => {
      console.log(err);
    });
  }

  private getTeachingTopics() {
    const queryTeaching = {
      'relInclude': 'experience'
    };
    this._profileService.getTeachingTopics(queryTeaching).subscribe((response) => {
      console.log(response);
      this.topicsTeaching = response;
    });
  }

  private getTopics() {
    this.getLearningTopics();
    this.getTeachingTopics();
    this.loaded = true;
  }

  /**
   * unfollowTopic
topic:any   */
  public unfollowTopic(topic: any) {
    console.log(topic);
    this._profileService.unfollowTopic(topic.id).subscribe((response) => {
      this.getTopics();
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * stopTeachingTopic
   */
  public stopTeachingTopic(topic: any) {
    this._profileService.stopTeachingTopic(topic.id).subscribe((response) => {
      this.getTopics();
    }, (err) => {
      console.log(err);
    });
  }

  public selected(event) {
    this.newTopics = event;
  }
  /**
   * removed
   */
  public removed(event) {
    console.log(event);
  }

  /**
   * AddTopics
   */
  public AddTopics(type: string) {
    if (this.newTopics) {
      const topicIds = [];
      this.newTopics.forEach(topic => {
        topicIds.push(topic.id);
      });
      if (type === 'learning') {
        this._profileService.followMultipleTopicsLearning({
          'targetIds': topicIds
        }).subscribe((response => {
          // this.getLearningTopics();
          this.topicsLearning = this.topicsLearning.concat(this.newTopics);
          this.newTopics = [];
          this.expansionpanelLearning.close();
        }));
      } else if (type === 'teaching') {
        this._profileService.followMultipleTopicsTeaching({
          'targetIds': topicIds
        }).subscribe((response => {
          // this.getTeachingTopics();
          this.topicsTeaching = this.topicsTeaching.concat(this.newTopics);
          this.newTopics = [];
          this.expansionpanelTeaching.close();
        }));
      } else {
        console.log('unknown type');
      }

    }
  }

  public updateChanges() {
    this.topicsTeaching.forEach(topic => {
      if (topic['experience']) {
        this._profileService.updateTeachingTopic(topic.id, { 'experience': topic['experience'] })
          .subscribe(response => {
            console.log(response);
            this.snackBar.open('Topics Updated', 'Close');
          }, err => {
            console.log(err);
            this.snackBar.open('Profile Update Failed', 'Retry').onAction().subscribe(() => {
              this.updateChanges();
            });
          });
      }
    });
  }

}
