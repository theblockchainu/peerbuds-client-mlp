import {
  Component, OnInit, Input, forwardRef, ElementRef, Inject, EventEmitter
  , HostBinding, HostListener, Output
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';

import { LeftSidebarService, SideBarMenuItem } from '../../_services/left-sidebar/left-sidebar.service';
import { CollectionService } from '../../_services/collection/collection.service';

import _ from 'lodash';

@Component({
  selector: 'app-left-sidebar',
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

  menuState = 'out';
  public menuJSON: Observable<Array<any>>;
  public step: number;
  public id: string;
  public path: string;
  public status = 'draft';
  public collection: any;

  sidebarMenuItems;

  // Input Parameter
  @Input('menuFile')
  private menuFile = '';

  @Output()
  private menuArray = new EventEmitter<any>();

  constructor(
    public router: Router,
    private _leftSidebarService: LeftSidebarService,
    private activatedRoute: ActivatedRoute,
    public _collectionService: CollectionService) {
  }

  ngOnInit() {
    this._leftSidebarService.getMenuItems(this.menuFile).subscribe(response => {
        this.sidebarMenuItems = response;
        this.menuArray.emit(this.sidebarMenuItems);
    });
    this.path = this.router.url.split('/')[1];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['workshopId']; // Need to make it generic or fetch different names like experienceId and put ||
      this.step = params['step'];
    });
    if (this.id) {
        const query = {
            'include': [
                'topics',
                'calendars',
                { 'participants': [{ 'profiles': ['work'] }] },
                { 'owners': ['profiles'] },
                { 'contents': ['schedules'] }
            ]
        };
        this._collectionService.getCollectionDetail(this.id, query)
            .subscribe(res => {
                    this.status = res.status;
                    this.collection = res;
                    this.updateSideMenu(this.collection);
                },
                err => console.log('error'),
                () => console.log('Completed!'));
    } else {
        console.log('NO COLLECTION');
    }
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

  updateSideMenu(collection) {
      let completedSections = 0;
      if (collection.status === 'draft') {
          this.sidebarMenuItems[4].visible = false;
          this.sidebarMenuItems[3].visible = true;
      }
      else {
          this.sidebarMenuItems[4].visible = true;
          this.sidebarMenuItems[3].visible = false;
          this.sidebarMenuItems.forEach(mainItem => {
            mainItem.submenu.forEach(item => {
                  item.locked = true;
              }, this);
          }, this);
      }
      if (collection.topics.length >= 3) {
          this.sidebarMenuItems[0].submenu[0].complete = true;
          completedSections++;
      }
      if (collection.language.length > 0) {
          this.sidebarMenuItems[0].submenu[1].complete = true;
          completedSections++;
      }
      if (collection.aboutHost.length > 0) {
          this.sidebarMenuItems[0].submenu[2].complete = true;
          completedSections++;
      }
      if (collection.title.length > 0 && collection.headline.length > 0) {
          this.sidebarMenuItems[1].submenu[0].complete = true;
          completedSections++;
      }
      if (collection.description.length > 0) {
          this.sidebarMenuItems[1].submenu[1].complete = true;
          completedSections++;
      }
      if (collection.difficultyLevel.length > 0 && collection.notes.length > 0) {
          this.sidebarMenuItems[1].submenu[2].complete = true;
          completedSections++;
      }
      if (collection.maxSpots.length > 0) {
          this.sidebarMenuItems[1].submenu[3].complete = true;
          completedSections++;
      }
      if (collection.imageUrls.length > 0 && collection.videoUrls.length > 0) {
          this.sidebarMenuItems[1].submenu[4].complete = true;
          completedSections++;
      }
      if (collection.price.length > 0 && collection.currency.length > 0 && collection.cancellationPolicy.length > 0) {
          this.sidebarMenuItems[1].submenu[5].complete = true;
          completedSections++;
      }
      if (collection.contents.length > 0) {
          this.sidebarMenuItems[2].submenu.forEach(item => {
            item.complete = true;
          }, this);
          completedSections++;
      }
      if (completedSections !== 10) {
        this.sidebarMenuItems[3].locked = true;
      }
      else {
          this.sidebarMenuItems[3].locked = false;
      }
      this.menuArray.emit(this.sidebarMenuItems);
  }

}
