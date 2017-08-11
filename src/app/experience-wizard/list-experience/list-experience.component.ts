import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CollectionService } from '../../_services/collection/collection.service';

@Component({
  selector: 'app-list-experience',
  templateUrl: './list-experience.component.html',
  styleUrls: ['./list-experience.component.scss']
})
export class ListExperienceComponent implements OnInit {

  public experiences: any[];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public _collectionService: CollectionService) {
  }

  ngOnInit() {
    this._collectionService.getCollection('experience', function (err, result) {
      if (err) {
        console.log(err);
      } else {
        this.experiences = result;
      }
    });
  }
  
  public onSelect(experience) {
    this.router.navigate(['/createExperience', experience.id]);
  }

  public showFinishingTouch(experience) {
    this.router.navigate(['/finishTouch', experience.id]);

  }

}
