import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FileUploadModule, ScheduleModule, DialogModule, CalendarModule, CheckboxModule } from 'primeng/primeng';

import { ExperienceWizardRoutingModule } from './experience-wizard-routing.module';
import { ExperienceCreateComponent } from './experience-create/experience-create.component';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceViewComponent } from './experience-view/experience-view.component';
import { LocationComponent } from './location/location.component';
import { AppointmentCalendarComponent } from "./appointment-calendar/appointment-calendar.component";


import { AppointmentService } from '../_services/appointment/appointment.service';

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
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAPmoHUhl1bF9IaSfOWzL4BLQqqMyButP4',
      libraries: ['places'],
      language: 'en-US'
    }),
    Ng4GeoautocompleteModule.forRoot(),
    FileUploadModule,
    ScheduleModule,
    DialogModule,
    CalendarModule,
    CheckboxModule
  ],
  declarations: [
    ExperienceCreateComponent,
    ExperienceContentComponent,
    ExperienceViewComponent,
    LocationComponent,
    AppointmentCalendarComponent
  ],
  providers: [AppointmentService]
})
export class ExperienceWizardModule { }
