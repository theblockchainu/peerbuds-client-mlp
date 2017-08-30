import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/_shared.module';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { WorkshopEditComponent } from './workshop-edit/workshop-edit.component';
import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { WorkshopContentOnlineComponent} from './workshop-content-online/workshop-content-online.component';
import { WorkshopContentProjectComponent} from './workshop-content-project/workshop-content-project.component';
import { WorkshopContentVideoComponent} from './workshop-content-video/workshop-content-video.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdProgressBarModule, MdListModule, MdTabsModule, MdSidenavModule, MdSelectModule, MdDatepickerModule, MdDialogModule, MdGridListModule, MdCheckboxModule } from '@angular/material';

import 'hammerjs';

@NgModule({
    imports: [
        SharedModule,
        WorkshopRoutingModule,
        MdCardModule,
        MdButtonModule,
        MdMenuModule,
        MdToolbarModule,
        MdIconModule,
        MdProgressBarModule,
        MdListModule,
        MdTabsModule,
        MdSidenavModule,
        MdSelectModule,
        MdDatepickerModule,
        MdDialogModule,
        MdGridListModule,
        MdCheckboxModule
    ],
    declarations: [
        WorkshopEditComponent,
        WorkshopContentComponent,
        ContentViewComponent,
        AppointmentCalendarComponent,
        WorkshopContentOnlineComponent,
        WorkshopContentProjectComponent,
        WorkshopContentVideoComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [WorkshopContentOnlineComponent, WorkshopContentProjectComponent, WorkshopContentVideoComponent]
})
export class WorkshopModule { }
