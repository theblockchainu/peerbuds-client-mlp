import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';

declare var moment: any;


@Component({
  selector: 'app-console-profile',
  templateUrl: './console-profile.component.html',
  styleUrls: ['./console-profile.component.scss']
})
export class ConsoleProfileComponent implements OnInit {

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
  public viewProfile() {
    this.router.navigate(['profile']);
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
