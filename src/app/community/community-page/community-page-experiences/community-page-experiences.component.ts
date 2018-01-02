import {Component, OnInit} from '@angular/core';
import {CommunityPageComponent} from '../community-page.component';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-community-page-experiences',
    templateUrl: './community-page-experiences.component.html',
    styleUrls: ['./community-page-experiences.component.scss']
})
export class CommunityPageExperiencesComponent implements OnInit {

    constructor(activatedRoute: ActivatedRoute,
                communityPageComponent: CommunityPageComponent) {
        /*activatedRoute.pathFromRoot[5].url.subscribe((urlSegment) => {
            console.log('activated route is: ' + JSON.stringify(urlSegment));
            if (urlSegment[0] === undefined) {
                communityPageComponent.setActiveTab('experiences');
            } else {
                communityPageComponent.setActiveTab(urlSegment[0].path);
            }
        });*/
    }

    ngOnInit() {
    }

}
