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

@NgModule({
    imports: [
        SharedModule,
        ExperienceRoutingModule,
    ],
    declarations: [
        ExperienceEditComponent,
        ExperienceContentComponent,
        ContentViewComponent,
        AppointmentCalendarComponent,
        ExperienceContentOnlineComponent,
        ExperienceContentProjectComponent,
        ExperienceContentVideoComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [ExperienceContentOnlineComponent, ExperienceContentProjectComponent, ExperienceContentVideoComponent]
})
export class ExperienceModule { }
