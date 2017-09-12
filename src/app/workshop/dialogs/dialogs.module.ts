import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { EditCalendarDialog } from './edit-calendar-dialog/edit-calendar-dialog.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AddLanguageDialogComponent } from './add-language-dialog/add-language-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [EditCalendarDialog, DeleteDialogComponent, AddTopicDialogComponent, AddLanguageDialogComponent],
  declarations: [EditCalendarDialog, DeleteDialogComponent, AddTopicDialogComponent, AddLanguageDialogComponent],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    EditCalendarDialog,
    AddTopicDialogComponent,
    DeleteDialogComponent,
    AddLanguageDialogComponent
  ],
})
export class DialogsModule { }