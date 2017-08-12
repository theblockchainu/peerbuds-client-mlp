import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';

declare var moment: any;

@Component({
  selector: 'app-console-learning',
  templateUrl: './console-learning.component.html',
  styleUrls: ['./console-learning.component.scss']
})
export class ConsoleLearningComponent implements OnInit {

  public workshops: any;
  public loaded: boolean;
  public activeTab: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService) {
    console.log(activatedRoute.pathFromRoot.toString());
    this.activeTab = 'all';
  }

  ngOnInit() {
    this.loaded = false;
  }

  /**
   * createWorkshop
   */
  public createWorkshop() {
    this._collectionService.postCollection('workshop').subscribe((workshopObject) => {
      this.router.navigate(['editWorkshop', workshopObject.id, 1]);
    });
  }

  /**
   * Check if the given tab is active tab
   * @param tabName
   * @returns {boolean}
   */
  public isTabActive(tabName) {
    return this.activeTab === tabName;
  }

}
