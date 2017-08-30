import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { AppConfig } from '../../app.config';

export class SideBarMenuItem {
    active: boolean;
    title: string;
    step: string;
    icon?: string;
    submenu: {};
}

@Injectable()
export class LeftSidebarService {


  sidebarMenuItems: Observable<SideBarMenuItem>;

  constructor(
      private http: Http, private config: AppConfig,
      private route: ActivatedRoute, public router: Router
  ) {}

  public getMenuItems(fileLocation: string): Observable<SideBarMenuItem> {
      return this.http.get(fileLocation)
                  .map((response: Response) => {
                    return response.json();
                  });
  }

  public updateSideMenu(collection, sidebarMenuItems) {
        let completedSections = 0;
        if (collection.status === 'draft') {
            sidebarMenuItems[4].visible = false;
            sidebarMenuItems[3].visible = true;
        }
        else if (collection.status === 'submitted') {
            sidebarMenuItems[4].visible = false;
            sidebarMenuItems[4].submenu[0].visible = false;
            sidebarMenuItems[4].submenu[1].visible = false;
            sidebarMenuItems[3].visible = false;
            sidebarMenuItems.forEach(mainItem => {
                if (mainItem.submenu !== undefined && mainItem.title !== 'Finishing Touches') {
                    mainItem.submenu.forEach(item => {
                        item.locked = true;
                    }, this);
                }
            });
        }
        else {
            sidebarMenuItems[4].visible = true;
            sidebarMenuItems[4].submenu[0].visible = true;
            sidebarMenuItems[4].submenu[1].visible = true;
            sidebarMenuItems[3].visible = false;
            sidebarMenuItems.forEach(mainItem => {
                if (mainItem.submenu !== undefined && mainItem.title !== 'Finishing Touches') {
                    mainItem.submenu.forEach(item => {
                        item.locked = true;
                    }, this);
                }
            });
        }
        if (collection.topics !== undefined && collection.topics.length >= 3) {
            sidebarMenuItems[0].submenu[0].complete = true;
            completedSections++;
        }
        if (collection.language !== undefined && collection.language.length > 0) {
            sidebarMenuItems[0].submenu[1].complete = true;
            completedSections++;
        }
        if (collection.aboutHost !== undefined && collection.aboutHost.length > 0) {
            sidebarMenuItems[0].submenu[2].complete = true;
            completedSections++;
        }
        if (collection.title !== undefined && collection.headline !== undefined && collection.title.length > 0 && collection.headline.length > 0) {
            sidebarMenuItems[1].submenu[0].complete = true;
            completedSections++;
        }
        if (collection.description !== undefined && collection.description.length > 0) {
            sidebarMenuItems[1].submenu[1].complete = true;
            completedSections++;
        }
        if (collection.difficultyLevel !== undefined  && collection.notes !== undefined && collection.difficultyLevel.length > 0 && collection.notes.length > 0) {
            sidebarMenuItems[1].submenu[2].complete = true;
            completedSections++;
        }
        if (collection.maxSpots !== undefined && collection.maxSpots.length > 0) {
            sidebarMenuItems[1].submenu[3].complete = true;
            completedSections++;
        }
        if (collection.imageUrls !== null && collection.videoUrls !== null && collection.imageUrls !== undefined && collection.videoUrls !== undefined && collection.imageUrls.length > 0 && collection.videoUrls.length > 0) {
            sidebarMenuItems[1].submenu[4].complete = true;
            completedSections++;
        }
        if (collection.price !== undefined && collection.currency !== undefined && collection.cancellationPolicy !== undefined && collection.price > 0 && collection.currency.length > 0 && collection.cancellationPolicy.length > 0) {
            sidebarMenuItems[1].submenu[5].complete = true;
            completedSections++;
        }
        if (collection.contents !== undefined && collection.contents.length > 0) {
            sidebarMenuItems[2].submenu.forEach(item => {
                item.complete = true;
            }, this);
            completedSections++;
        }
        if (completedSections !== 10) {
            sidebarMenuItems[3].locked = true;
        }
        else {
            sidebarMenuItems[3].locked = false;
        }
        if (collection.owners !== undefined && collection.owners[0].phoneVerified) {
            sidebarMenuItems[4].submenu[0].complete = true;
        }
        return sidebarMenuItems;
    }
}
