import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
// import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import {
  MatChipsModule, MatDialogModule, MatMenuModule, MatButtonModule,
  MatCardModule, MatToolbarModule, MatIconModule, MatProgressBarModule,
  MatListModule, MatTabsModule, MatTableModule, MatInputModule, MatCheckboxModule,
  MatSidenavModule, MatSelectModule, MatDatepickerModule, MatGridListModule, MatRadioModule,
  MatNativeDateModule, MatSliderModule, MatProgressSpinnerModule, MatExpansionModule, MatSnackBarModule
} from '@angular/material';
import {
  ModalModule, BsDropdownModule, ProgressbarModule,
  TabsModule, PopoverModule, CarouselModule, DatepickerModule, TimepickerModule
} from 'ngx-bootstrap';
import {
  FileUploadModule, ScheduleModule, DialogModule,
  CheckboxModule, LightboxModule, RatingModule,
  AccordionModule, SliderModule
} from 'primeng/primeng';
import { NgPipesModule } from 'ngx-pipes';
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
import { DialogsService } from '../workshop/dialogs/dialog.service';
import { TopicService } from '../_services/topic/topic.service';
import { CommentService } from '../_services/comment/comment.service';
import { NotificationService } from '../_services/notification/notification.service';
import { ExtractTimePipe } from '../_shared/extract-time/extract-time.pipe';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule,
    CommonModule,
    PopoverModule.forRoot(),
    CalendarModule.forRoot(),
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0)',
      backdropBorderRadius: '0px',
      primaryColour: '#33bd9e',
      secondaryColour: '#ff5b5f',
      tertiaryColour: '#ff6d71'
    })
  ],
  declarations: [ExtractTimePipe],
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
    CurrencypickerService,
    DialogsService,
    CommentService,
    TopicService,
    NotificationService//,
    // {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
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
    LeftSidebarModule,
    CarouselModule,
    DatepickerModule,
    TimepickerModule,
    FinishingTouchesModule,
    NgPipesModule,
    AccordionModule,
    MatChipsModule, MatDialogModule, MatMenuModule, MatButtonModule,
    MatCardModule, MatToolbarModule, MatIconModule, MatProgressBarModule,
    MatListModule, MatTabsModule, MatTableModule, MatInputModule, MatCheckboxModule,
    MatSidenavModule, MatSelectModule, MatDatepickerModule, MatGridListModule, MatRadioModule,
    MatNativeDateModule, MatSliderModule,
    SliderModule, MatProgressSpinnerModule, MatExpansionModule, MatSnackBarModule, ExtractTimePipe,
    LoadingModule
  ]
})
export class SharedModule { }
