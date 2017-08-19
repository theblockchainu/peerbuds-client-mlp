import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkshopPageComponent } from './workshop-page.component';
const routes: Routes = [
  {
    path: '',
    component: WorkshopPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopPageRoutingModule { }
