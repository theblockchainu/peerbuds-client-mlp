import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/_shared.module';
import { ExperienceRoutingModule } from './experience-routing.module';
import { ExperienceEditComponent } from './experience-edit/experience-edit.component';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceContentOnlineComponent } from './experience-content-online/experience-content-online.component';
import { ExperienceContentProjectComponent } from './experience-content-project/experience-content-project.component';
import { ExperienceContentVideoComponent } from './experience-content-video/experience-content-video.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { } from '@angular/material';
import 'hammerjs';
import { ExperienceSubmitDialogComponent } from './experience-edit/experience-submit-dialog/experience-submit-dialog.component';
import { ExperienceCloneDialogComponent } from './experience-edit/experience-clone-dialog/experience-clone-dialog.component';
import { DialogsModule } from './dialogs/dialogs.module';

@NgModule({
    imports: [
        SharedModule,
        ExperienceRoutingModule,
        DialogsModule],
    declarations: [
        ExperienceEditComponent,
        ExperienceContentComponent,
        ContentViewComponent,
        AppointmentCalendarComponent,
        ExperienceContentOnlineComponent,
        ExperienceContentProjectComponent,
        ExperienceContentVideoComponent,
        ExperienceSubmitDialogComponent,
        ExperienceCloneDialogComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [ExperienceContentOnlineComponent, ExperienceContentProjectComponent, ExperienceContentVideoComponent, ExperienceSubmitDialogComponent, ExperienceCloneDialogComponent]
})
export class ExperienceModule { }
