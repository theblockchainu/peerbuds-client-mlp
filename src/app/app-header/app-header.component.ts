import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  isLoggedIn : Observable<boolean>;

  constructor(public authService : AuthenticationService) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  ngOnInit() {
  }

}
