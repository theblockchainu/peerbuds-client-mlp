import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';
import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';
import { AuthService } from '../_services/auth/auth.service';
import { WorkshopPageComponent } from './workshop-page/workshop-page.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':workshopId',
        children: [
          {
            path: '',
            component: WorkshopPageComponent,
            canActivateChild: [AuthGuardService]
          },
          {
            path: 'edit/:step',
            component: WorkshopEditComponent,
            canActivateChild: [AuthGuardService]
          }
        ]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
