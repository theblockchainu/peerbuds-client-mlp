import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';

@Component({
  selector: 'app-index-phil',
  templateUrl: './index-philosophy.component.html',
  styleUrls: ['./index-philosophy.component.scss']
})
export class IndexPhilComponent implements OnInit {

  public transformationSelected = false
  public pplFocussedSelected = false;
  public courageSelected = false;
  public collabSelected = false;
  public optimismSelected = false;

  constructor() { 
    this.transformationSelected = true;
  }

  ngOnInit() {
  }

  public showTransformation(state) {
    this.transformationSelected = state;
    this.pplFocussedSelected = !state;
    this.courageSelected = !state;
    this.collabSelected = !state;
    this.optimismSelected = !state;
  }
  
  public showPplFocussed(state) {
    this.transformationSelected = !state;
    this.pplFocussedSelected = state;
    this.courageSelected = !state;
    this.collabSelected = !state;
    this.optimismSelected = !state;
  }
  
  public showCourage(state) {
    this.transformationSelected = !state;
    this.pplFocussedSelected = !state;
    this.courageSelected = state;
    this.collabSelected = !state;
    this.optimismSelected = !state;
  }
  
  public showCollab(state) {
    this.transformationSelected = !state;
    this.pplFocussedSelected = !state;
    this.courageSelected = !state;
    this.collabSelected = state;
    this.optimismSelected = !state;
  }
  
  public showOptimism(state) {
    this.transformationSelected = !state;
    this.pplFocussedSelected = !state;
    this.courageSelected = !state;
    this.collabSelected = !state;
    this.optimismSelected = state;
  }
<<<<<<< HEAD
}

=======

}
>>>>>>> fe71d294a3adcebf7ad84d0d3a95e3f77d5b5197
