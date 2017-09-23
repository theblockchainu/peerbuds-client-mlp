import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { IndexComponent } from './index/index.component';

import { IndexPhilComponent } from './index-philosophy/index-philosophy.component';

import {
    MdButtonModule, MdCardModule, MdIconModule, MdInputModule, MdProgressBarModule, MdSelectModule,
    MdToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule, 
    IndexComponent,
    IndexPhilComponent

    DefaultRoutingModule,
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
