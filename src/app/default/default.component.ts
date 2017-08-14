import { Component } from '@angular/core';

@Component({
  template:  `
    <div style="text-align: center; margin-top: 10%">
      Peerbuds HomeFeed
    </div>
    <router-outlet></router-outlet>
  `
})
export class DefaultComponent {
}
