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
import { ExperienceContentInpersonComponent } from './experience-content-inperson/experience-content-inperson.component';
import { AddLocationDialogComponent } from './add-location-dialog/add-location-dialog.component';
import {Ng4GeoautocompleteModule} from 'ng4-geoautocomplete';
import {AgmCoreModule} from '@agm/core';

@NgModule({
    imports: [
        SharedModule,
        ExperienceRoutingModule,
        DialogsModule,
        Ng4GeoautocompleteModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCCXlBKSUs2yVH1dUogUgb0Ku2VmmR61Ww'
        }),
    ],
    declarations: [
        ExperienceEditComponent,
        ExperienceContentComponent,
        ContentViewComponent,
        AppointmentCalendarComponent,
        ExperienceContentOnlineComponent,
        ExperienceContentProjectComponent,
        ExperienceContentVideoComponent,
        ExperienceSubmitDialogComponent,
        ExperienceCloneDialogComponent,
        ExperienceContentInpersonComponent,
        AddLocationDialogComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [ExperienceContentOnlineComponent, ExperienceContentProjectComponent, ExperienceContentInpersonComponent, ExperienceContentVideoComponent, ExperienceSubmitDialogComponent, ExperienceCloneDialogComponent, AddLocationDialogComponent]
})
export class ExperienceModule { }
