import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule } from 'ngx-bootstrap';
import { FileUploadModule, ScheduleModule, DialogModule, CalendarModule, CheckboxModule } from 'primeng/primeng';


import { CollectionService } from '../_services/collection/collection.service';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../_services/languagepicker/languagepicker.service';
import { AppointmentService } from '../_services/appointment/appointment.service';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { MediaUploaderService } from '../_services/mediaUploader/media-uploader.service';

@NgModule({
  imports: [
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    CommonModule
  ],
  declarations: [],
  providers: [
    CollectionService,
    CountryPickerService,
    LanguagePickerService,
    AppointmentService,
    RequestHeaderService,
    MediaUploaderService
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule,
    ModalModule,
    RatingModule,
    TabsModule,
    BsDropdownModule,
    FileUploadModule,
    ScheduleModule,
    DialogModule,
    CalendarModule,
    CheckboxModule
  ]
})
export class SharedModule { }
