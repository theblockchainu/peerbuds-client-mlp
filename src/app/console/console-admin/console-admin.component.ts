import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsoleComponent } from '../console.component';
import { CollectionService } from '../../_services/collection/collection.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-console-admin',
  templateUrl: './console-admin.component.html',
  styleUrls: ['./console-admin.component.css']
})
export class ConsoleAdminComponent implements OnInit {
  public loaded: boolean;
  public unapprovedCollections: Array<any>;
  constructor(
    activatedRoute: ActivatedRoute,
    consoleComponent: ConsoleComponent,
    public _collectionService: CollectionService,
    public snackBar: MdSnackBar
  ) {
    activatedRoute.pathFromRoot[3].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.fetchCollections();
  }

  private fetchCollections() {
    this.loaded = false;
    const query = {
      'where': { 'type': 'workshop', 'isApproved': false, 'status': 'submitted' },
      'include': [
        'calendars'
      ]
    };
    this._collectionService.getAllCollections(query).subscribe(
      result => {
        this.unapprovedCollections = result;
        this.loaded = true;
      }, err => {
        console.log(err);
      }
    );
  }

  public approveWorkshop(collection: any) {

    this._collectionService.approveCollection(collection).subscribe(
      result => {
        this.snackBar.open(result.result, 'Close').onAction().subscribe(() => {
          this.fetchCollections();
        });
      }, err => {
        console.log(err);
      }
    );
  }

}
