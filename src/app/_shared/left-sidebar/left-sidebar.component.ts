import {
  Component, OnInit, Input, forwardRef, ElementRef, Inject, EventEmitter
  , HostBinding, HostListener, Output
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BehaviorSubject, Observable } from "rxjs";
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';

import { LeftSidebarService, SideBarMenuItem } from '../../_services/left-sidebar/left-sidebar.service';
import { CollectionService } from '../../_services/collection/collection.service';

import _ from 'lodash';

@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class LeftSidebarComponent implements OnInit {

  menuState: string = 'out';
  public menuJSON: Observable<Array<any>>;
  public step: number;
  public id: string;
  public path: string;
  public status: string = 'draft';

  sidebarMenuItems;

  // Input Parameter
  @Input('menuFile')
  private menuFile: string = '';

  @Output()
  private menuArray = new EventEmitter<any>();

  constructor(
    public router: Router,
    private _leftSidebarService: LeftSidebarService,
    private activatedRoute: ActivatedRoute,
    public _collectionService: CollectionService) {
    if (this.id) {
      this._collectionService.getCollectionDetails(this.id)
        .subscribe(res => {
          this.status = res.status;
        },
        err => console.log('error'),
        () => console.log('Completed!'));
    } else {
      console.log('NO COLLECTION');
    }
  }

  ngOnInit() {
    this._leftSidebarService.getMenuItems(this.menuFile).subscribe(response => {
      this.sidebarMenuItems = response;

      if (this.status != 'submitted') {
        this.sidebarMenuItems[4].visible = false;
        this.sidebarMenuItems[3].visible = true;
      }
      else {
        this.sidebarMenuItems[4].visible = true;
        this.sidebarMenuItems[3].visible = false;
      }

      this.menuArray.emit(this.sidebarMenuItems);
    });
    this.path = this.router.url.split('/')[1];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['workshopId']; //Need to make it generic or fetch different names like experienceId and put ||
      this.step = params['step'];
    });
  }

  public toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  public goto(step) {
    if (_.includes(step, '_')) {
      step = _.take(step.split('_'))[0];
    }
    this.step = +step;
    this.router.navigate([this.path, this.id, 'edit', step]);
  }



}
