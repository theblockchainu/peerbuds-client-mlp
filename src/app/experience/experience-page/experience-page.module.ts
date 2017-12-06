import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/_shared.module';
import { ViewParticipantsComponent } from './view-participants/view-participants.component';
import { ExperienceVideoComponent } from './experience-video/experience-video.component';
import { ContentOnlineComponent } from './content-online/content-online.component';
import { ContentVideoComponent } from './content-video/content-video.component';
import { ContentProjectComponent } from './content-project/content-project.component';
import { MessageParticipantComponent } from './message-participant/message-participant.component';
import { ExperiencePageRoutingModule } from './experience-page-routing.module';
import { ExperiencePageComponent } from './experience-page.component';
import { SelectDateDialogComponent } from './select-date-dialog/select-date-dialog.component';
import { SubmitEntryComponent } from './submit-entry/submit-entry.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../_services/project-submission/project-submission.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { StickyModule } from 'ng2-sticky-kit';

@NgModule({
  imports: [
    ExperiencePageRoutingModule,
    CommonModule,
    SharedModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0)',
      backdropBorderRadius: '0px',
      primaryColour: '#33bd9e',
      secondaryColour: '#ff5b5f',
      tertiaryColour: '#ff6d71'
    }),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ClipboardModule,
    StickyModule
  ],

  declarations: [ExperiencePageComponent, ViewParticipantsComponent, ExperienceVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent, SelectDateDialogComponent, SubmitEntryComponent, SubmissionViewComponent, DeleteDialogComponent, InviteFriendsDialogComponent],
  bootstrap: [ViewParticipantsComponent, ExperienceVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent, SelectDateDialogComponent, SubmitEntryComponent, SubmissionViewComponent, DeleteDialogComponent, InviteFriendsDialogComponent],
  providers: [ProjectSubmissionService]

})
export class ExperiencePageModule { }
