import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { EditCalendarDialog } from './edit-calendar-dialog/edit-calendar-dialog.component';
import { ViewConflictDialog } from './view-conflict-dialog/view-conflict-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [EditCalendarDialog, DeleteDialogComponent],
  declarations: [EditCalendarDialog, ViewConflictDialog, DeleteDialogComponent],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    EditCalendarDialog,
    ViewConflictDialog,
    DeleteDialogComponent
  ],
})
export class DialogsModule { }