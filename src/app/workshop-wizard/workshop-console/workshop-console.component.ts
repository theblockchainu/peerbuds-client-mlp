import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CollectionService } from '../../_services/collection/collection.service';

@Component({
  selector: 'app-workshop-console',
  templateUrl: './workshop-console.component.html',
  styleUrls: ['./workshop-console.component.scss']
})
export class WorkshopConsoleComponent implements OnInit {

  public workshops: any[];
  public loaded: boolean;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService) {
  }

  ngOnInit() {
    this.loaded = false;
    this._collectionService.getCollection('workshop', (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.workshops = result;
        this.loaded = true;
      }
    });
  }

  public onSelect(workshop) {
    this.router.navigate(['/createWorkshop', workshop.id]);
  }

  public showFinishingTouch(workshop) {
    this.router.navigate(['/finishTouch', workshop.id]);
  }

  /**
   * createWorkshop
   */
  public createWorkshop() {
    this._collectionService.postCollection('workshop').subscribe((workshopObject) => {
      this.router.navigate(['editWorkshop', workshopObject.id, 0]);
    });
  }

}
