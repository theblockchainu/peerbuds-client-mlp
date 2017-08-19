import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsoleTeachingComponent} from '../console-teaching.component';
import {CollectionService} from '../../../_services/collection/collection.service';

@Component({
  selector: 'app-console-teaching-experience',
  templateUrl: './console-teaching-experience.component.html',
  styleUrls: ['./console-teaching-experience.component.scss', '../console-teaching.component.scss', '../../console.component.scss']
})
export class ConsoleTeachingExperienceComponent implements OnInit {

  public collections: any;
  public loaded: boolean;
  public now: Date;
  private outputResult: any;
  public activeTab: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleTeachingComponent: ConsoleTeachingComponent,
    public router: Router,
    public _collectionService: CollectionService
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleTeachingComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getOwnedCollections('{ "where": {"type":"experience"}, "include": ["calendars", "owners", {"participants": "profiles"}, "topics", {"contents":"schedules"}] }', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let draftCount = 0, activeCount = 0, pastCount = 0;
        this.outputResult = {};
        this.outputResult['data'] = [];
        this.outputResult.draftCount = 0;
        this.outputResult.activeCount = 0;
        this.outputResult.pastCount = 0;
        result.forEach((resultItem) => {
          switch (resultItem.status) {
            case 'draft' || 'submitted':
              draftCount++;
              break;
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
        this.outputResult.draftCount = draftCount;
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
