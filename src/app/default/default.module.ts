import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule
  ],
  declarations: [IndexComponent]
})
export class DefaultModule { }
