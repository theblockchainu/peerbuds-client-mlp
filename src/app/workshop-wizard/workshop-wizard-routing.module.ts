import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWorkshopComponent } from "./create-workshop/create-workshop.component";
import { ListWorkshopComponent } from "./list-workshop/list-workshop.component";

import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';
import { AuthService } from '../_services/auth/auth.service';

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
      pathMatch: 'full',
      canActivateChild: [AuthGuardService]
    },
    {
      path: ':step',
      component: CreateWorkshopComponent,
      canActivateChild: [AuthGuardService]
    }
  ]
},
{
  path: 'workshop', component: ListWorkshopComponent,
  canActivate: [AuthGuardService]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]//,
  //providers: [AuthGuardService]
})
export class WorkshopWizardRoutingModule { }
