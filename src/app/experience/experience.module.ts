import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/_shared.module';
import { ExperienceRoutingModule } from './experience-routing.module';
import { ExperienceEditComponent } from './experience-edit/experience-edit.component';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceContentProjectComponent } from './experience-content-project/experience-content-project.component';
import { ExperienceContentVideoComponent } from './experience-content-video/experience-content-video.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { } from '@angular/material';
import 'hammerjs';
import {ExperienceContentInpersonComponent} from './experience-content-inperson/experience-content-inperson.component';
import {AgmCoreModule} from '@agm/core';
import {Ng4GeoautocompleteModule} from 'ng4-geoautocomplete';
import {AddLocationDialogComponent} from './add-location-dialog/add-location-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        ExperienceRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCCXlBKSUs2yVH1dUogUgb0Ku2VmmR61Ww'
        }),
        Ng4GeoautocompleteModule.forRoot()
    ],
    declarations: [
        ExperienceEditComponent,
        ExperienceContentComponent,
        ContentViewComponent,
        AppointmentCalendarComponent,
        ExperienceContentProjectComponent,
        ExperienceContentVideoComponent,
        ExperienceContentInpersonComponent,
        AddLocationDialogComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [ExperienceContentProjectComponent, ExperienceContentVideoComponent, ExperienceContentInpersonComponent, AddLocationDialogComponent]
})
export class ExperienceModule { }
