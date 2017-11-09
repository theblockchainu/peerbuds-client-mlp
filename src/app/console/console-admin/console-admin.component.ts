import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsoleComponent } from '../console.component';
import { CollectionService } from '../../_services/collection/collection.service';
import { ProfileService } from '../../_services/profile/profile.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-console-admin',
  templateUrl: './console-admin.component.html',
  styleUrls: ['./console-admin.component.css']
})
export class ConsoleAdminComponent implements OnInit {
  public collectionsLoaded: boolean;
  public unapprovedCollections: Array<any>;
  public unapprovedPeers: Array<any>;
  public peersLoaded: boolean;
  constructor(
    activatedRoute: ActivatedRoute,
    consoleComponent: ConsoleComponent,
    public _collectionService: CollectionService,
    public _profileService: ProfileService,
    public snackBar: MdSnackBar
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.fetchCollections();
    this.fetchPeers();
  }

  private fetchPeers() {
    this.peersLoaded = false;
    const query = {
      'where': { 'accountVerified': false },
      'include': [
        'profiles'
      ]
    };
    this._profileService.getAllPeers(query).subscribe(result => {
      this.unapprovedPeers = result.json();
      this.peersLoaded = true;
    }, err => {
      console.log(err);
    });
  }

  private fetchCollections() {
    this.collectionsLoaded = false;
    const query = {
      'where': { 'type': 'workshop', 'isApproved': false, 'status': 'submitted' },
      'include': [
        'calendars'
      ]
    };
    this._collectionService.getAllCollections(query).subscribe(
      result => {
        this.unapprovedCollections = result;
        this.collectionsLoaded = true;
      }, err => {
        console.log(err);
      }
    );
  }

  public approveWorkshop(collection: any) {

    this._collectionService.approveCollection(collection).subscribe(
      result => {
        console.log(result);
        this.snackBar.open(result.result, 'Close').onAction().subscribe(() => {
          this.fetchCollections();
        });
      }, err => {
        console.log(err);
      }
    );
  }

  /**
   * approvePeer
   */
  public approvePeer(peer) {
    this._profileService.approvePeer(peer).subscribe(result => {
      this.snackBar.open(result.result, 'Close').onAction().subscribe(() => {
        this.fetchPeers();
      });
    }, err => {
      console.log(err);
    });
  }

}
