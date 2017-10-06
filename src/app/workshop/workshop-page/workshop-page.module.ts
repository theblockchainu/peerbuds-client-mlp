import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/_shared.module';
import { ViewParticipantsComponent } from './view-participants/view-participants.component';
import { WorkshopVideoComponent } from './workshop-video/workshop-video.component';
import { ContentOnlineComponent } from './content-online/content-online.component';
import { ContentVideoComponent } from './content-video/content-video.component';
import { ContentProjectComponent } from './content-project/content-project.component';
import { MessageParticipantComponent } from './message-participant/message-participant.component';
import { WorkshopPageRoutingModule } from './workshop-page-routing.module';
import { WorkshopPageComponent } from './workshop-page.component';
import { SelectDateDialogComponent } from './select-date-dialog/select-date-dialog.component';
import { SubmitEntryComponent } from './submit-entry/submit-entry.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../_services/project-submission/project-submission.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@NgModule({
  imports: [
    WorkshopPageRoutingModule,
    CommonModule,
    SharedModule
  ],

  declarations: [WorkshopPageComponent, ViewParticipantsComponent, WorkshopVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent, SelectDateDialogComponent, SubmitEntryComponent, SubmissionViewComponent, DeleteDialogComponent],
  bootstrap: [ViewParticipantsComponent, WorkshopVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent, SelectDateDialogComponent, SubmitEntryComponent, SubmissionViewComponent, DeleteDialogComponent],
  providers: [ProjectSubmissionService]

})
export class WorkshopPageModule { }
