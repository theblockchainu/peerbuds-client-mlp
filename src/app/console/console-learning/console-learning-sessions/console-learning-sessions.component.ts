import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsoleLearningComponent} from '../console-learning.component';
import {CollectionService} from '../../../_services/collection/collection.service';

@Component({
  selector: 'app-console-learning-sessions',
  templateUrl: './console-learning-sessions.component.html',
  styleUrls: ['./console-learning-sessions.component.scss', '../../console.component.scss']
})
export class ConsoleLearningSessionsComponent implements OnInit {

  public collections: any;
  public loaded: boolean;
  public now: Date;
  private outputResult: any;
  public activeTab: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleLearningComponent: ConsoleLearningComponent,
    public _collectionService: CollectionService,
    public router: Router
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleLearningComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getParticipatingCollections('{ "relInclude": "calendarId", "where": {"type":"session"}, "include": ["calendars", {"owners":"profiles"}, {"participants": "profiles"}, "topics", {"contents":"schedules"}, {"reviews":"peer"}] }', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let activeCount = 0, pastCount = 0;
        this.outputResult = {};
        this.outputResult['data'] = [];
        this.outputResult.activeCount = 0;
        this.outputResult.pastCount = 0;
        result.forEach((resultItem) => {
          switch (resultItem.status) {
            case 'active':
              activeCount++;
              break;
            case 'complete':
              pastCount++;
              break;
            default:
              break;
          }
          this.outputResult.data.push(resultItem);
        });
        this.outputResult.activeCount = activeCount;
        this.outputResult.pastCount = pastCount;
        this.collections = this.outputResult;
        console.log(this.collections);
        this.now = new Date();
        this.loaded = true;
      }
    });
  }

  public onSelect(workshop) {
    this.router.navigate(['workshop', workshop.id, 'edit', 1]);
  }

}
