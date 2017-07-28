import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CollectionService } from '../../_services/collection/collection.service';

@Component({
  selector: 'app-list-workshop',
  templateUrl: './list-workshop.component.html',
  styleUrls: ['./list-workshop.component.scss']
})
export class ListWorkshopComponent implements OnInit {

  public workshops:any[];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService) {
    }

  ngOnInit() {
    this.workshops = this._collectionService.getCollection('workshop');
  }

  public onSelect(workshop) {
    this.router.navigate(['/createWorkshop', workshop.id]);
  }

  public showFinishingTouch(workshop) {
    this.router.navigate(['/finishTouch', workshop.id]);

  }

}
