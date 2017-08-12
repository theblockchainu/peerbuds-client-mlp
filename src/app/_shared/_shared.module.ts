import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdChipsModule, MdDialogModule, MdMenuModule } from '@angular/material';
import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule, PopoverModule, } from 'ngx-bootstrap';
import { FileUploadModule, ScheduleModule, DialogModule, CalendarModule, CheckboxModule, LightboxModule } from 'primeng/primeng';
import { MultiselectAutocompleteModule } from './multiselect-autocomplete/multiselect-autocomplete.module';
import { SocialSyncModule } from './socialsync/socialsync.module';
import { LeftSidebarModule } from './left-sidebar/left-sidebar.module';


import { CollectionService } from '../_services/collection/collection.service';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../_services/languagepicker/languagepicker.service';
import { AppointmentService } from '../_services/appointment/appointment.service';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { MediaUploaderService } from '../_services/mediaUploader/media-uploader.service';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ContentService } from '../_services/content/content.service';
import { LeftSidebarService } from '../_services/left-sidebar/left-sidebar.service';

@NgModule({
  imports: [
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    CommonModule,
    PopoverModule.forRoot()
  ],
  declarations: [],
  providers: [
    CollectionService,
    CountryPickerService,
    LanguagePickerService,
    AppointmentService,
    RequestHeaderService,
    MediaUploaderService,
    CookieUtilsService,
    ContentService,
    LeftSidebarService
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
    CheckboxModule,
    MultiselectAutocompleteModule,
    SocialSyncModule,
    PopoverModule,
    LightboxModule,
    MdChipsModule,
    LeftSidebarModule,
    MdDialogModule,
    MdMenuModule
  ]
})
export class SharedModule { }
