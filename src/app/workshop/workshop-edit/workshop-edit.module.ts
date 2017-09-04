import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/_shared.module';
import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { WorkshopContentOnlineComponent } from './workshop-content-online/workshop-content-online.component';
import { WorkshopContentProjectComponent } from './workshop-content-project/workshop-content-project.component';
import { WorkshopContentVideoComponent } from './workshop-content-video/workshop-content-video.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { WorkshopEditRoutingModule } from './workshop-edit-routing.module';
import { WorkshopEditComponent } from './workshop-edit.component';

@NgModule({
  imports: [
    WorkshopEditRoutingModule,
    CommonModule,
    SharedModule
  ],

  declarations: [
    WorkshopContentComponent,
    ContentViewComponent,
    WorkshopContentOnlineComponent,
    WorkshopContentProjectComponent,
    WorkshopContentVideoComponent,
    WorkshopEditComponent
  ],
  bootstrap: [WorkshopContentOnlineComponent, WorkshopContentProjectComponent, WorkshopContentVideoComponent],
  providers: []

})
export class WorkshopEditModule { }
