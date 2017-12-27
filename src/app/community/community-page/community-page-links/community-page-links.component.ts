import { Component, OnInit } from '@angular/core';
import {CommunityPageComponent} from '../community-page.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-community-page-links',
  templateUrl: './community-page-links.component.html',
  styleUrls: ['./community-page-links.component.scss']
})
export class CommunityPageLinksComponent implements OnInit {

    constructor(
        activatedRoute: ActivatedRoute,
        communityPageComponent: CommunityPageComponent
    ) {
        activatedRoute.pathFromRoot[5].url.subscribe((urlSegment) => {
            console.log('activated route is: ' + JSON.stringify(urlSegment));
            if (urlSegment[0] === undefined) {
                communityPageComponent.setActiveTab('questions');
            } else {
                communityPageComponent.setActiveTab(urlSegment[0].path);
            }
        });
    }

  ngOnInit() {
  }

}
