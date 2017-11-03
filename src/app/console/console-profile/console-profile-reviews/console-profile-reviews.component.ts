import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { ProfileService } from '../../../_services/profile/profile.service';
import { CollectionService } from '../../../_services/collection/collection.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';
import { ConsoleTeachingComponent } from '../../console-teaching/console-teaching.component';

@Component({
  selector: 'app-console-profile-reviews',
  templateUrl: './console-profile-reviews.component.html',
  styleUrls: ['./console-profile-reviews.component.scss', '../console-profile.component.scss', '../../console.component.scss']
})
export class ConsoleProfileReviewsComponent implements OnInit {

  private userId;
  public loading: boolean;
  public profile: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _profileService: ProfileService,
    public _collectionService: CollectionService,
    private _cookieUtilsService: CookieUtilsService
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
    this.userId = _cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.loading = true;
    this._profileService.getProfile(this.userId).subscribe((profiles) => {
      console.log(profiles);
      this.profile = profiles[0];
      console.log(this.profile);
      this.loading = false;
    });
  }

  /**
   * Find the collection object for a particular collection ID
   * @param peer
   * @param collectionId
   */
  public getReviewedCollection(peer, collectionId) {
    let foundCollection: any;
    const collectionsArray = peer.collections;
    const ownedCollectionsArray = peer.ownedCollections;
    if (collectionsArray !== undefined) {
      foundCollection = collectionsArray.find((collection) => {
        return collection.id === collectionId;
      });
    }
    if (ownedCollectionsArray !== undefined && foundCollection === undefined) {
      foundCollection = ownedCollectionsArray.find((collection) => {
        return collection.id === collectionId;
      });
    }
    if (foundCollection === undefined) {
      foundCollection = {};
    }
    return foundCollection;

  }

  /**
   * Find the collection object for a particular collection ID
   * @param calendars
   * @param calendarId
   */
  public getReviewedCalendar(calendars, calendarId) {
      return calendars.find((calendar) => {
        return calendar.id === calendarId;
      }) !== undefined ? calendars.find((calendar) => {
        return calendar.id === calendarId;
      }) : {};
  }

  /**
   * Check if given peer is a teacher
   * @param peer
   * @returns {boolean}
   */
  public isTeacher(peer) {
    return peer.ownedCollections !== undefined && peer.ownedCollections.length > 0;
  }

  /**
   * Get the list of all collections pending a review to be given to student
   * @param peer
   * @param reviewsByYou
   * @returns {any[]}
   */
  public getPendingReviewCollections(peer) {
    let pendingReviewCollections: any[] = [];
    if (!this.isTeacher(peer)) {
      pendingReviewCollections = undefined;
    } else {
      const completeCollections = this._collectionService.filerCompleteCollections(peer.ownedCollections);
      completeCollections.forEach(collection => {
        let hasPending = false;
        if (collection.participants !== undefined) {
          collection.participants.forEach(participant => {
            // If one of the participant of a collection does not have a review
            if (peer.reviewsByYou === undefined || !peer.reviewsByYou.some(review => {
                return review.collectionId === collection.id && review.reviewedPeer[0].id === participant.id;
              })) {
              hasPending = true;
            }
          });
        }
        if (hasPending) {
          pendingReviewCollections.push(collection);
        }
      });
    }
    console.log('pending collections: ' + pendingReviewCollections);
    return pendingReviewCollections;
  }

}
