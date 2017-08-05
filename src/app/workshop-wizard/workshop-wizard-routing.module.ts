import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkshopConsoleComponent } from './workshop-console/workshop-console.component';
import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';
import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';
import { AuthService } from '../_services/auth/auth.service';

const routes: Routes = [
  {
    path: 'editWorkshop/:workshopId',
    children: [
      {
        path: '',
        component: WorkshopEditComponent,
        pathMatch: 'full',
        canActivateChild: [AuthGuardService]
      },
      {
        path: ':step',
        component: WorkshopEditComponent,
        canActivateChild: [AuthGuardService]
      }
    ]
  },
  {
    path: 'workshop', component: WorkshopConsoleComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopWizardRoutingModule { }
