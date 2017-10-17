import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from '../_services/authentication/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {

  public isVisible = true;
  public activePage = '';
  isLoggedIn: Observable<boolean>;
  loggedIn: boolean;

  constructor(
    public authService: AuthenticationService,
    public activatedRoute: ActivatedRoute
  ) {
      this.isLoggedIn = authService.isLoggedIn();
      authService.isLoggedIn().subscribe((res) => {
          this.loggedIn = res;
      });
  }
  ngOnInit() {
  }

}
