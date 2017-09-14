import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { SharedModule } from '../_shared/_shared.module';
import { ProfileComponent } from './profile.component';

import { ProfileRoutingModule } from './profile-routing.module';
import { MdTabsModule } from '@angular/material';
import { BookSessionComponent } from './book-session/book-session.component';
import { BookSessionJoinComponent } from './book-session-join/book-session-join.component';
import { SeeDatesWorkshopComponent } from './see-dates-workshop/see-dates-workshop.component';
import { SeeDatesExperienceComponent } from './see-dates-experience/see-dates-experience.component';
import { EditSessionComponent } from './edit-session/edit-session.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    MdTabsModule
  ],
  declarations: [ProfileComponent, BookSessionComponent, BookSessionJoinComponent, SeeDatesWorkshopComponent, SeeDatesExperienceComponent, EditSessionComponent]
})
export class ProfileModule { }
