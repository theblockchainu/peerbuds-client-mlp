import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceCreateComponent } from './experience-create/experience-create.component';
import { ListExperienceComponent } from './list-experience/list-experience.component';

import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';
import { AuthService } from '../_services/auth/auth.service';

const routes: Routes = [
  {
    path: 'createExperience',
    component: ExperienceCreateComponent
  },
  {
    path: 'createExperience/:id',
    children: [
      {
        path: '',
        component: ExperienceCreateComponent,
        pathMatch: 'full',
        canActivateChild: [AuthGuardService]
      },
      {
        path: ':step',
        component: ExperienceCreateComponent,
        canActivateChild: [AuthGuardService]
      }
    ]
  },
  {
    path: 'experience', component: ListExperienceComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperienceWizardRoutingModule { }
