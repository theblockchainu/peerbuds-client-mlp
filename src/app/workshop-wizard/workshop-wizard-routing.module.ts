import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWorkshopComponent } from "./create-workshop/create-workshop.component";
import { ListWorkshopComponent } from "./list-workshop/list-workshop.component";
const routes: Routes = [
{
  path: 'createWorkshop', component: CreateWorkshopComponent
},
// { path: 'createWorkshop/:id', component: CreateWorkshopComponent },
{
  path: 'createWorkshop/:id',
  children: [
    {
      path: '',
      component: CreateWorkshopComponent,
      pathMatch: 'full'
    },
    {
      path: ':step',
      component: CreateWorkshopComponent
    }
  ]
},
{
  path: 'workshop', component: ListWorkshopComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopWizardRoutingModule { }
