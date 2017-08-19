import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk';

import {
  MdChipsModule, MdDialogModule, MdMenuModule, MdButtonModule,
  MdCardModule, MdToolbarModule, MdIconModule, MdProgressBarModule,
  MdListModule, MdTabsModule, MdTableModule, MdInputModule
} from '@angular/material';
import {
  ModalModule, RatingModule, BsDropdownModule, ProgressbarModule,
  TabsModule, PopoverModule, CarouselModule, DatepickerModule, TimepickerModule
} from 'ngx-bootstrap';
import {
  FileUploadModule, ScheduleModule, DialogModule,
  CheckboxModule, LightboxModule
} from 'primeng/primeng';

import { CalendarModule } from 'angular-calendar';

import { MultiselectAutocompleteModule } from './multiselect-autocomplete/multiselect-autocomplete.module';
import { SocialSyncModule } from './socialsync/socialsync.module';
import { LeftSidebarModule } from './left-sidebar/left-sidebar.module';
import { FinishingTouchesModule } from '../finishing-touches/finishing-touches.module';

import { CollectionService } from '../_services/collection/collection.service';
import { CountryPickerService } from '../_services/countrypicker/countrypicker.service';
import { LanguagePickerService } from '../_services/languagepicker/languagepicker.service';
import { AppointmentService } from '../_services/appointment/appointment.service';
import { RequestHeaderService } from '../_services/requestHeader/request-header.service';
import { MediaUploaderService } from '../_services/mediaUploader/media-uploader.service';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ContentService } from '../_services/content/content.service';
import { LeftSidebarService } from '../_services/left-sidebar/left-sidebar.service';
import { CurrencypickerService } from '../_services/currencypicker/currencypicker.service';

@NgModule({
  imports: [
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    CommonModule,
    PopoverModule.forRoot(),
    CalendarModule.forRoot()
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
    LeftSidebarService,
    CurrencypickerService
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
    MdMenuModule,
    CarouselModule,
    DatepickerModule,
    TimepickerModule,
    FinishingTouchesModule,
    MdCardModule,
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdProgressBarModule,
    MdListModule,
    MdTabsModule,
    MdTableModule,
    CdkTableModule,
    MdInputModule
  ]
})
export class SharedModule { }
