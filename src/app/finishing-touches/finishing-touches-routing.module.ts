import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishingTouchComponent } from './finishing-touch/finishing-touch.component';

const routes: Routes = [
  // {
  //   path: 'finishingTouches',
  //   component: FinishingTouchComponent
  // }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinishingTouchesRoutingModule { }
