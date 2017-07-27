import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienceWizardRoutingModule } from './experience-wizard-routing.module';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceViewComponent } from './experience-view/experience-view.component';

@NgModule({
  imports: [
    CommonModule,
    ExperienceWizardRoutingModule
  ],
  declarations: [ExperienceContentComponent, ExperienceViewComponent]
})
export class ExperienceWizardModule { }
