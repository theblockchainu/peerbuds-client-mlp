import { NgModule } from '@angular/core';
import { SharedModule } from '../_shared/_shared.module';
import { WorkshopRoutingModule } from './workshop-routing.module';

import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { } from '@angular/material';
import 'hammerjs';
import { WorkshopSubmitDialogComponent } from './workshop-edit/workshop-submit-dialog/workshop-submit-dialog.component';
import { WorkshopCloneDialogComponent } from './workshop-edit/workshop-clone-dialog/workshop-clone-dialog.component';

import { WorkshopPageModule } from './workshop-page/workshop-page.module';
import { DialogsModule } from './dialogs/dialogs.module';


@NgModule({
    imports: [
        SharedModule,
        WorkshopRoutingModule,
        DialogsModule
    ],
    declarations: [
        AppointmentCalendarComponent,
        WorkshopSubmitDialogComponent,
        WorkshopCloneDialogComponent
    ],
    providers: [],
    bootstrap: [],
    entryComponents: [WorkshopSubmitDialogComponent, WorkshopCloneDialogComponent]
})
export class WorkshopModule { }
