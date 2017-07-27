import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWorkshopComponent } from "./create-workshop/create-workshop.component";
const routes: Routes = [{
  path: 'createWorkshop', component: CreateWorkshopComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopWizardRoutingModule { }
