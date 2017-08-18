import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/_shared.module';

import { WorkshopRoutingModule } from './workshop-routing.module';

import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';

import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { WorkshopPageComponent } from './workshop-page/workshop-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdProgressBarModule, MdListModule, MdTabsModule } from '@angular/material';
import 'hammerjs';
import { WorkshopPageModule } from './workshop-page/workshop-page.module';


@NgModule({
  imports: [
    SharedModule,
    WorkshopRoutingModule,
    BrowserAnimationsModule,
    WorkshopPageModule
  ],
  declarations: [
    WorkshopEditComponent,
    WorkshopContentComponent,
    ContentViewComponent,
    AppointmentCalendarComponent,
    WorkshopPageComponent,

  ],
  providers: [
  ],
  bootstrap: []
})
export class WorkshopModule { }
