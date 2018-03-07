import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { ProfileService } from '../../../_services/profile/profile.service';
import { AccordionItem } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';

import { DialogsService } from '../../../_services/dialogs/dialog.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';

import _ from 'lodash';
import { AppConfig } from '../../../app.config';
@Component({
  selector: 'app-console-profile-topics',
  templateUrl: './console-profile-topics.component.html',
  styleUrls: ['./console-profile-topics.component.scss']
})
export class ConsoleProfileTopicsComponent implements OnInit {

  private userId;
  public loading: boolean;
  public topicsLearning: Array<any> = [];
  public topicsTeaching: Array<any> = [];
  public searchTopicURL = '';
  public placeholderStringTopic = 'Search for a topic ';
  private newTopics: Array<any>;
  private selectedTopicsLearning = [];
  private selectedTopicsTeaching = [];

  @ViewChild('expansionpanelLearning') expansionpanelLearning: AccordionItem;
  @ViewChild('expansionpanelTeaching') expansionpanelTeaching: AccordionItem;


  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _profileService: ProfileService,
    public snackBar: MdSnackBar,
    public _dialogService: DialogsService,
    private _cookieUtilsService: CookieUtilsService,
    private config: AppConfig
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
    this.userId = _cookieUtilsService.getValue('userId');
    this.searchTopicURL = config.searchUrl + '/api/search/' + this.config.uniqueDeveloperCode + '_topics/suggest?field=name&query=';
  }

  ngOnInit() {
    this.loading = true;
    this.getTopics();
  }

  private getLearningTopics() {
    const querylearning = {};
    this._profileService.getLearningTopics(this.userId, querylearning).subscribe((response) => {
      this.topicsLearning = response;
    }, (err) => {
      console.log(err);
    });
  }

  private getTeachingTopics() {
    const queryTeaching = {
      'relInclude': 'experience'
    };
    this._profileService.getTeachingTopics(this.userId, queryTeaching).subscribe((response) => {
      console.log(response);
      this.topicsTeaching = response;
    });
  }

  private getTopics() {
    this.getLearningTopics();
    this.getTeachingTopics();
    this.loading = false;
  }

  /**
   * unfollowTopic
topic:any   */
  public unfollowTopic(type, topic: any) {
    console.log(topic);
    this._profileService.unfollowTopic(this.userId, type, topic.id).subscribe((response) => {
      this.getTopics();
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * stopTeachingTopic
   */
  public stopTeachingTopic(topic: any) {
    this._profileService.stopTeachingTopic(this.userId, topic.id).subscribe((response) => {
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
        this._profileService.followMultipleTopicsLearning(this.userId, {
          'targetIds': topicIds
        }).subscribe((response => {
          this.topicsLearning = this.topicsLearning.concat(this.newTopics);
          this.newTopics = [];
          this.expansionpanelLearning.close();
        }));
      } else if (type === 'teaching') {
        this._profileService.followMultipleTopicsTeaching(this.userId, {
          'targetIds': topicIds
        }).subscribe((response => {
          this.topicsTeaching = this.topicsTeaching.concat(this.newTopics);
          this.newTopics = [];
          this.expansionpanelTeaching.close();
        }));
      } else {
        console.log('unknown type');
      }

    }
  }

  public updateChanges(type, topic) {
    if (topic['experience']) {
      this._profileService.updateTeachingTopic(this.userId, topic.id, { 'experience': topic['experience'] })
        .subscribe(response => {
          console.log(response);
          this.snackBar.open('Topic Updated', 'Close', {
            duration: 800
          });
        }, err => {
          console.log(err);
          this.snackBar.open('Topic Update Failed', 'Retry', {
            duration: 800
          }).onAction().subscribe(() => {
            this.updateChanges(type, topic);
          });
        });
    }
  }

  public openFollowTopicDialog(type) {
    this._dialogService
      .openFollowTopicDialog(type, this.searchTopicURL)
      .subscribe(res => {
        const topicArray = [];
        if (res.selected) {
          if (type === 'learning') {
            this.selectedTopicsLearning = res.selected;

            this.selectedTopicsLearning.forEach((topic) => {
              topicArray.push(topic.id);
              this.topicsLearning.push(topic);
            });
          }
          else {
            this.selectedTopicsTeaching = res.selected;
            this.selectedTopicsTeaching.forEach((topic) => {
              topicArray.push(topic.id);
              this.topicsTeaching.push(topic);
            });
          }
          topicArray.forEach(topicId => {
            this._profileService.followTopic(this.userId, type, topicId, {})
              .subscribe((response) => { console.log(response); });
          });
        }
      });
  }

}
