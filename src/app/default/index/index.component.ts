import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public isLoggedIn;
  public loggedIn = false;
  constructor(private _authService: AuthenticationService,
              private _router: Router) {
    this.isLoggedIn = _authService.isLoggedIn();
    _authService.isLoggedIn().subscribe((res) => {
      this.loggedIn = res;
    });
    if(this.loggedIn) {
      this._router.navigate(['home', 'homefeed']);
    }
   }

  ngOnInit() {
  }

}
