import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule } from 'ngx-bootstrap';
import { FileUploadModule, ScheduleModule, DialogModule, CalendarModule, CheckboxModule } from 'primeng/primeng';

import { AuthenticationService } from "../_services/authentication/authentication.service";
import { CountryPickerService } from "../_services/countrypicker/countrypicker.service";
import { LanguagePickerService } from "../_services/languagepicker/languagepicker.service";
import { AppointmentService } from '../_services/appointment/appointment.service';

import { WorkshopWizardRoutingModule } from './workshop-wizard-routing.module';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { ListWorkshopComponent } from './list-workshop/list-workshop.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

@NgModule({
  imports: [
    CommonModule,
    WorkshopWizardRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    ScheduleModule,
    DialogModule,
    CalendarModule,
    CheckboxModule
  ],
  declarations: [
    CreateWorkshopComponent,
    WorkshopContentComponent,
    ContentViewComponent,
    ListWorkshopComponent,
    AppointmentCalendarComponent],
  providers: [
    AuthenticationService,
    CountryPickerService,
    LanguagePickerService,
    AppointmentService
  ]
})
export class WorkshopWizardModule { }
