import { Component } from '@angular/core';

@Component({
  template:  `
    <h3>Home Page</h3>
    <nav>
      <a routerLink="./" routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
      <!--<a routerLink="./crises" routerLinkActive="active">Manage Crises</a>
      <a routerLink="./heroes" routerLinkActive="active">Manage Heroes</a>-->
    </nav>
    <router-outlet></router-outlet>
  `
})
export class HomeComponent {
}
