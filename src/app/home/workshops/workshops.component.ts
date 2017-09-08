import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  public userId: string;
  constructor(
    public _collectionService: CollectionService,
    public _profileService: ProfileService,
    private _cookieUtilsService: CookieUtilsService,

  ) {
    this.userId = _cookieUtilsService.getValue('userId');

  }
  ngOnInit() {
    this.fetchWorkshops();
  }

  fetchWorkshops() {
    const query = {
      'include': [
        'collections'
      ]
    };
    this._profileService.getTopics(this.userId, query).subscribe(
      (result) => {
        console.log(result.json());
      }, (err) => {
        console.log(err);
      }
    );
  }

}
