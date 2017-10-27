import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { ProfileService } from '../../../_services/profile/profile.service';
import { AppConfig } from '../../../app.config';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { DialogsService } from '../../../_services/dialogs/dialog.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-console-profile-verification',
  templateUrl: './console-profile-verification.component.html',
  styleUrls: ['./console-profile-verification.component.scss']
})
export class ConsoleProfileVerificationComponent implements OnInit {

  private userId;
  public loading: boolean = false;
  public profile: any;
  public alreadyVerified: Array<any>;
  public notVerified: Array<any>;
  private queryForSocialIdentities = {'include': ['identities', 'credentials']};
  public socialIdentitiesConnected: any = [];
  public boolShowConnectedSocials = false;
  private connectedIdentities = {
    'fb': false,
    'google': false
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    private dialog: MdDialog,
    private dialogsService: DialogsService,
    public _profileService: ProfileService,
    public config: AppConfig,
    private _cookieUtilsService: CookieUtilsService
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.loading = true;
    this.getProfile();
  }

   public openIdVerify() {
    this.dialogsService.openIdVerify().subscribe();
  }

  public openEmailVerify() {
   this.dialogsService.openEmailVerify().subscribe();
  }

  public openPhoneVerify() {
    this.dialogsService.openPhoneVerify().subscribe();
   }

  private getProfile() {
    this._profileService.getPeerData(this.userId, this.queryForSocialIdentities).subscribe((peer) => {
      console.log(peer);
      this.alreadyVerified = [];
      this.notVerified = [];
      if (peer.phoneVerified) {
        this.alreadyVerified.push({
          text: 'Phone Number',
          value: peer.phone
        });
      } else {
        if (peer.phone) {
          this.notVerified.push({
            text: 'Phone Number',
            value: peer.phone
          });
        } else {
          this.notVerified.push({
            text: 'Phone Number',
            value: ''
          });
        }
      }
      if (peer.emailVerified && peer.email) {
        this.alreadyVerified.push({
          text: 'Email address',
          value: peer.email
        });
      } else {
        if (peer.email) {
          this.notVerified.push({
            text: 'Email address',
            value: peer.email
          });
        } else {
          this.notVerified.push({
            text: 'Email address',
            value: ''
          });
        }
      }
      if (peer.accountVerified && peer.verificationIdUrl) {
        this.alreadyVerified.push({
          text: 'Government Id',
          value: peer.verificationIdUrl
        });
      } else {
        if (peer.verificationIdUrl) {
          this.notVerified.push({
            text: 'Government Id',
            value: peer.verificationIdUrl
          });
        } else {
          this.notVerified.push({
            text: 'Government Id',
            value: 'A Government ID is required for us to make sure you are legit.'
          });
        }
      }

      this.socialIdentitiesConnected = peer;
      
      // this.socialIdentitiesConnected.forEach(socialIdentity => {
      if(this.socialIdentitiesConnected.identities.length > 0) {
        this.socialIdentitiesConnected.identities.forEach(element => {
          if(element.provider === 'google') {
              this.connectedIdentities.google = true;
          }
          else if (element.provider === 'facebook') {
            this.connectedIdentities.fb = true;
          }
        });
      }
      if(this.socialIdentitiesConnected.credentials.length > 0) {
        this.socialIdentitiesConnected.credentials.forEach(element => {
          if(element.provider === 'google') {
              this.connectedIdentities.google = true;
          }
          else if (element.provider === 'facebook') {
            this.connectedIdentities.fb = true;
          }
        });
      }
      this.loading = false;
    });
  }

}
