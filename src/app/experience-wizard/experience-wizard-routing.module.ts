import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceCreateComponent } from './experience-create/experience-create.component';

const routes: Routes = [
  {
    path: 'experience',
    component: ExperienceCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperienceWizardRoutingModule { }
