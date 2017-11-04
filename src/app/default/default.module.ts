import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { IndexComponent } from './index/index.component';
import { IndexComponent1 } from './index1/index1.component';
import { IndexPhilComponent } from './index-philosophy/index-philosophy.component';
import {
    MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdProgressBarModule, MdSelectModule,
    MdToolbarModule
} from '@angular/material';
//import {CSSCarouselComponent} from './carousal/carousal.component';




@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    IndexComponent,
    IndexComponent1,
    IndexPhilComponent,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    MdIconModule,
    MdProgressBarModule,
    MdInputModule,
    MdSelectModule
  ],
  declarations: [IndexComponent]
})
export class DefaultModule { }
