import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../../_services/collection/collection.service';
import { ConsoleTeachingComponent } from '../console-teaching.component';

declare var moment: any;

@Component({
  selector: 'app-console-teaching-workshop',
  templateUrl: './console-teaching-workshop.component.html',
  styleUrls: ['./console-teaching-workshop.component.scss', '../console-teaching.component.scss', '../../console.component.scss']
})
export class ConsoleTeachingWorkshopComponent implements OnInit {

  public collections: any;
  public loaded: boolean;
  public now: Date;
  private outputResult: any;
  public activeTab: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleTeachingComponent: ConsoleTeachingComponent,
    public _collectionService: CollectionService,
    public router: Router
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleTeachingComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getOwnedCollections('{ "where": {"type":"workshop"}, "include": ["calendars", "owners", {"participants": "profiles"}, "topics", {"contents":"schedules"}] }', (err, result) => {
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
    this.router.navigate(['/editWorkshop/', workshop.id, 1]);
  }
}
