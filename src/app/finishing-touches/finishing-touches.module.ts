import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinishingTouchesRoutingModule } from './finishing-touches-routing.module';
import { FinishingTouchComponent } from './finishing-touch/finishing-touch.component';

@NgModule({
  imports: [
    CommonModule,
    FinishingTouchesRoutingModule
  ],
  declarations: [FinishingTouchComponent]
})
export class FinishingTouchesModule { }
