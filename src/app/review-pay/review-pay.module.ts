import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/_shared.module';

import { ReviewPayRoutingModule } from './review-pay-routing.module';
import { ReviewPayComponent } from './review-pay.component';
import { MdTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReviewPayRoutingModule,
    MdTooltipModule
  ],
  declarations: [ReviewPayComponent]
})
export class ReviewPayModule { }
