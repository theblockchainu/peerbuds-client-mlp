import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { IndexComponent } from './index/index.component';
import { IndexPhilComponent } from './index-philosophy/index-philosophy.component';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule
  ],
  declarations: [IndexPhilComponent]
})
export class DefaultModule { }
