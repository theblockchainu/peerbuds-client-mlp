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

  public socialIdentitiesConnected: any = [];

  private connectedIdentities = {
    'fb': false,
    'google': false
  };

  constructor(
    private http: Http,
    private config: AppConfig,
    private _profileService: ProfileService) { }

  ngOnInit() {
    this._profileService.getSocialIdentities()
      .subscribe((response: Response) => {
        this.socialIdentitiesConnected = response;

        // this.socialIdentitiesConnected.forEach(socialIdentity => {
        //   if (socialIdentity[0].provider === 'google') {
        //     this.connectedIdentities.google = true;
        //   }
        //   if (socialIdentity[0].provider === 'facebook') {
        //     this.connectedIdentities.fb = true;
        //   }
        // });
        // console.log(JSON.stringify(response));

      },
      (err) => {
        console.log('Error: ' + err);
      });
  }

}
