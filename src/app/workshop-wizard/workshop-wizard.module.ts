import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/_shared.module';

import { WorkshopWizardRoutingModule } from './workshop-wizard-routing.module';

import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { ListWorkshopComponent } from './list-workshop/list-workshop.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

@NgModule({
  imports: [
    SharedModule,
    WorkshopWizardRoutingModule
  ],
  declarations: [
    CreateWorkshopComponent,
    WorkshopContentComponent,
    ContentViewComponent,
    ListWorkshopComponent,
    AppointmentCalendarComponent],
  providers: [
  ]
})
export class WorkshopWizardModule { }
