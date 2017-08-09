import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions
        , RequestOptionsArgs } from '@angular/http';
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

  constructor(private http: Http, private config: AppConfig
              , private route: ActivatedRoute, public router: Router) { 
              }

  public getMenuItems(fileLocation: string): Observable<SideBarMenuItem> {
      return this.http.get(fileLocation)
                  .map((response: Response) => {
                    return response.json();
                  });
  }

}
