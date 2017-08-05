import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/_shared.module';

import { WorkshopWizardRoutingModule } from './workshop-wizard-routing.module';

import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';

import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { WorkshopConsoleComponent } from './workshop-console/workshop-console.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

@NgModule({
  imports: [
    SharedModule,
    WorkshopWizardRoutingModule
  ],
  declarations: [
    WorkshopEditComponent,
    WorkshopContentComponent,
    ContentViewComponent,
    WorkshopConsoleComponent,
    AppointmentCalendarComponent],
  providers: [
  ]
})
export class WorkshopWizardModule { }
