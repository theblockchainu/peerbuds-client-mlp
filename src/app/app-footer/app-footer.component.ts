import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {

  public isVisible = true;
  public activePage = '';

  constructor(
      public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
  }

}
