import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceOnboardingComponent } from './experience-wizard.component';

const routes: Routes = [
  {
    path: 'experience',
    component: ExperienceOnboardingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperienceWizardRoutingModule { }
