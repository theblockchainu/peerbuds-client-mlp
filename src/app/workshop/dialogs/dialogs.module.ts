import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { EditCalendarDialog } from './edit.calendar.dialog.component';
import { ViewConflictDialog } from './view.conflict.dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [EditCalendarDialog],
  declarations: [EditCalendarDialog, ViewConflictDialog],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    EditCalendarDialog,
    ViewConflictDialog
  ],
})
export class DialogsModule { }
