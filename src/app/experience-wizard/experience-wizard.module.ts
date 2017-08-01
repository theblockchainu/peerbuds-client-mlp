import { NgModule } from '@angular/core';

import { SharedModule } from "../_shared/_shared.module";

import { AgmCoreModule } from '@agm/core';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { ExperienceWizardRoutingModule } from './experience-wizard-routing.module';
import { ExperienceCreateComponent } from './experience-create/experience-create.component';
import { ExperienceContentComponent } from './experience-content/experience-content.component';
import { ExperienceViewComponent } from './experience-view/experience-view.component';
import { LocationComponent } from './location/location.component';
import { AppointmentCalendarComponent } from "./appointment-calendar/appointment-calendar.component";

@NgModule({
  imports: [
    SharedModule,
    ExperienceWizardRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAPmoHUhl1bF9IaSfOWzL4BLQqqMyButP4',
      libraries: ['places'],
      language: 'en-US'
    }),
    Ng4GeoautocompleteModule.forRoot()
  ],
  declarations: [
    ExperienceCreateComponent,
    ExperienceContentComponent,
    ExperienceViewComponent,
    LocationComponent,
    AppointmentCalendarComponent
  ],
  providers: []
})
export class ExperienceWizardModule { }
