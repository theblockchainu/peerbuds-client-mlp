import {Component, OnInit} from '@angular/core';
import {CommunityPageComponent} from '../community-page.component';
import {ActivatedRoute} from '@angular/router';
import {CollectionService} from '../../../_services/collection/collection.service';
import {CookieUtilsService} from '../../../_services/cookieUtils/cookie-utils.service';
import {CommunityService} from "../../../_services/community/community.service";

@Component({
    selector: 'app-community-page-workshops',
    templateUrl: './community-page-workshops.component.html',
    styleUrls: ['./community-page-workshops.component.scss']
})
export class CommunityPageWorkshopsComponent implements OnInit {

    public ownedWorkshops;
    public userId;
    public communityId;

    constructor(public activatedRoute: ActivatedRoute,
                public communityPageComponent: CommunityPageComponent,
                public _collectionService: CollectionService,
                public _communityService: CommunityService,
                public _cookieUtilsService: CookieUtilsService) {
        activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
            console.log('activated route is: ' + JSON.stringify(urlSegment));
            if (urlSegment[0] === undefined) {
                this.communityId = '';
            } else {
                this.communityId = urlSegment[0].path;
            }
        });
        this.activatedRoute.pathFromRoot[5].url.subscribe((urlSegment) => {
            console.log('activated route is: ' + JSON.stringify(urlSegment));
            if (urlSegment[0] === undefined) {
                this._communityService.setActiveTab('workshops');
            } else {
                this._communityService.setActiveTab(urlSegment[0].path);
            }
        });
        this.userId = _cookieUtilsService.getValue('userId');
    }

    ngOnInit() {
        this.getWorkshops();
    }

    public getWorkshops() {
        this._collectionService.getOwnedCollections(this.userId, JSON.stringify({'where': {'and': [{'status': 'active'}, {'type': 'workshop'}]}}), (err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.ownedWorkshops = res;
            }
        });
    }

}
