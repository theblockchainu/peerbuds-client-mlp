import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../_services/alert/alert.service';
import { AuthenticationService } from '../_services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Set our default values
  public model: any = {};
  public loading = false;
  public returnUrl: string;
  public loggedIn = false;
  // TypeScript public modifiers

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public login() {
      this.loading = true;
      this.loggedIn = this.authenticationService.isLoggedIn();
      this.authenticationService.login(this.model.username, this.model.password)
          .subscribe(
              (data) => {
                  this.router.navigate([this.returnUrl]);
              },
              (error) => {
                  this.alertService.error(error._body);
                  this.loading = false;
              });
  }

  public signup(provider) {
    this.authenticationService.signup(provider).subscribe(
      (data) => {
      }
    );
  }

  private redirect() {
    this.router.navigate([ this.returnUrl ]); // use the stored url here
  }

}
