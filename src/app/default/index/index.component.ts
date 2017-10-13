import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';

import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../app-header/app-header.component';
import { LoginComponentDialog } from '../../_services/dialogs/login-dialog/login-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
items: Array<any> = []


  public isLoggedIn;
  public loggedIn = false;
  constructor(private _authService: AuthenticationService,
              private _router: Router,
              public dialog: MdDialog) {
    this.isLoggedIn = _authService.isLoggedIn();
    _authService.isLoggedIn().subscribe((res) => {
      this.loggedIn = res;
    });
    if(this.loggedIn) {
      this._router.navigate(['home', 'homefeed']);
    }
      this.items = [
      { name: 'assets/images/images_landing/Shape_testimoni.png' },
      { name: '/assets/images/images_landing/testimonial1.png' },
      { name: '/assets/images/images_landing/testimonial2.png' },
      { name: '/assets/images/images_landing/testimonial3.png' },
      { name: '/assets/images/images_landing/arrow-left.png' }
    ]
   }
  
  ngOnInit() {
  }
}