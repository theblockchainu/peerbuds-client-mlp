import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../_services/auth/auth.service';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { ProfileService } from '../_services/profile/profile.service';
import {FormControl} from '@angular/forms';
import {AppConfig} from '../app.config';
import {Http} from '@angular/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppHeaderComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  public profile: any = {};
  public userType = '';
  public myControl = new FormControl('');
  public userId: string;
  private key = 'userId';
  public options: any[];
  public defaultProfileUrl = '/assets/images/default-user.jpg';

  constructor(public authService: AuthenticationService,
              public requestHeaderService: RequestHeaderService,
              public config: AppConfig,
              private http: Http,
              private _cookieService: CookieService,
              private _profileService: ProfileService) {
    this.isLoggedIn = authService.isLoggedIn();
    this.userId = this.getCookieValue(this.key);
  }

  ngOnInit() {
    this.getProfile();
    this.myControl.valueChanges.subscribe((value) => {
      this.getAllSearchResults(value, (err, result) => {
        if (!err) {
          this.options = result;
        } else {
          console.log(err);
        }
      });
    });
  }

  private getCookieValue(key: string) {
    const cookie = this._cookieService.get(key);
    if (cookie) {
      const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
      this.userId = cookieValue[1];
    }
    return this.userId;
  }

  getProfile() {
    if(this.isLoggedIn) {
        this._profileService.getProfile().subscribe(profile => {
            this.profile = profile[0];
        });
    }
  }

  public getAllSearchResults(query: any, cb) {
    if (this.userId) {
      this.http
        .get(this.config.searchUrl + '/searchAll?' + 'query=' + query)
        .map((response) => {
          console.log(response.json());
          cb(null, response.json());
        }, (err) => {
          cb(err);
        }).subscribe();
    }
  }

  public getSearchOptionText(option) {
    switch (option.index) {
      case 'collection':
        switch (option.data.type) {
          case 'workshop':
            return option.data.title;
          case 'experience':
            return option.data.title;
          default:
            return option.data.title;
        }
      case 'topic':
        return option.data.name;
      case 'peer':
        if (option.data.profiles[0].first_name === undefined) {
          return option.data.id;
        } else {
          return option.data.profiles[0].first_name + ' ' + option.data.profiles[0].last_name;
        }
      default:
        return;
    }
  }

  public getSearchOptionType(option) {
    switch (option.index) {
      case 'collection':
        switch (option.data.type) {
          case 'workshop':
            return 'Workshop : ';
          case 'experience':
            return 'Experience : ';
          default:
            return 'Collection : ';
        }
      case 'topic':
        return 'Topic : ';
      case 'peer':
        return 'Peer : ';
      default:
        return;
    }
  }

}
