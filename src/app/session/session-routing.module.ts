import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionEditComponent } from './session-edit/session-edit.component';
import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: ':collectionId',
      //   loadChildren: './session-page/session-page.module#SessionPageModule'
      // },
      {
        path: ':collectionId/edit/:step',
        component: SessionEditComponent,
        canActivateChild: [AuthGuardService]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
