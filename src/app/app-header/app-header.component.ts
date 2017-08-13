import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../_services/auth/auth.service';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { AppConfig } from '../app.config';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  public profile: any = {};
  public userType = '';
  public defaultProfileUrl = '/assets/images/default-user.jpg';

  constructor(public authService: AuthenticationService, public requestHeaderService: RequestHeaderService,
    private config: AppConfig) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.requestHeaderService.getProfile().subscribe(profile => {
      this.profile = profile;
    });
  }

}
