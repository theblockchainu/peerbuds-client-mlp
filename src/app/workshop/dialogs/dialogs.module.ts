import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { MdDialogModule, MdButtonModule, MdRadioModule, MdIconModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';

import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { EditCalendarDialog } from './edit.calendar.dialog.component';
// import { ViewConflictDialog } from './view.conflict.dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MdDialogModule,
    MdButtonModule,
    MdRadioModule,
    MdIconModule,
    MdSelectModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [ EditCalendarDialog ],
  declarations: [ EditCalendarDialog ],
  providers: [
      DialogsService,
  ],
  entryComponents: [
    EditCalendarDialog,
  ],
})
export class DialogsModule { }
