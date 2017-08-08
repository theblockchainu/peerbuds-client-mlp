import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/_shared.module';

import { WorkshopRoutingModule } from './workshop-routing.module';

import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';

import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { WorkshopConsoleComponent } from './workshop-console/workshop-console.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { WorkshopPageComponent } from './workshop-page/workshop-page.component';


@NgModule({
  imports: [
    SharedModule,
    WorkshopRoutingModule
  ],
  declarations: [
    WorkshopEditComponent,
    WorkshopContentComponent,
    ContentViewComponent,
    WorkshopConsoleComponent,
    AppointmentCalendarComponent,
    WorkshopPageComponent],
  providers: [
  ]
})
export class WorkshopModule { }
