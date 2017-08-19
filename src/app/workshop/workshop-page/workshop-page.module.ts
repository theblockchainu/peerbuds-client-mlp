import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { SharedModule } from '../../_shared/_shared.module';
import { ViewParticipantsComponent } from './view-participants/view-participants.component';
import { WorkshopVideoComponent } from './workshop-video/workshop-video.component';
import { ContentOnlineComponent } from './content-online/content-online.component';
import { ContentVideoComponent } from './content-video/content-video.component';
import { ContentProjectComponent } from './content-project/content-project.component';
import { MessageParticipantComponent } from './message-participant/message-participant.component';
import { WorkshopPageRoutingModule } from './workshop-page-routing.module';
import { WorkshopPageComponent } from './workshop-page.component';

@NgModule({
  imports: [
    WorkshopPageRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [WorkshopPageComponent, DeleteDialogComponent, ViewParticipantsComponent, WorkshopVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent],
  bootstrap: [DeleteDialogComponent, DeleteDialogComponent, ViewParticipantsComponent, WorkshopVideoComponent, ContentOnlineComponent, ContentVideoComponent, ContentProjectComponent, MessageParticipantComponent]

})
export class WorkshopPageModule { }
