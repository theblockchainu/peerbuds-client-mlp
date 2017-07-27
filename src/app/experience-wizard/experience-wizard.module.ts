import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule } from 'ngx-bootstrap';

import { ExperienceWizardRoutingModule } from './experience-wizard-routing.module';
import { ExperienceCreateComponent } from './experience-create/experience-create.component';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceViewComponent } from './experience-view/experience-view.component';

@NgModule({
imports: [
  CommonModule,
  ExperienceWizardRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  ImageUploadModule.forRoot(),
  ProgressbarModule.forRoot(),
  ModalModule.forRoot(),
  RatingModule.forRoot(),
  TabsModule.forRoot(),
  BsDropdownModule.forRoot()
],
  declarations: [ExperienceCreateComponent, ExperienceContentComponent, ExperienceViewComponent]
})
export class ExperienceWizardModule { }
