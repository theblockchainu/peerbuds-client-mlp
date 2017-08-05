import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppConfig } from '../../app.config';

import { ProfileService } from '../../_services/profile/profile.service';

@Component({
  selector: 'app-socialsync',
  templateUrl: './socialsync.component.html',
  styleUrls: ['./socialsync.component.scss']
})
export class SocialSyncComponent implements OnInit {

  private connectedIdentities = {
    'fb' : false,
    'google': false
  }

  constructor(
    private http: Http, 
    private config: AppConfig,
    private _profileService: ProfileService) { }

  ngOnInit() {
    this._profileService.getSocialIdentities()
        .subscribe((response: Response) => {
                  //if(response)
              }, 
              (err) => {
                        console.log('Error: ' + err);
                });
  }

}
