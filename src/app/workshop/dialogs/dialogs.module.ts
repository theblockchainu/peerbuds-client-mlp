import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { EditCalendarDialogComponent } from './edit-calendar-dialog/edit-calendar-dialog.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AddLanguageDialogComponent } from './add-language-dialog/add-language-dialog.component';
import {ViewConflictDialogComponent} from './view-conflict-dialog/view-conflict-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [EditCalendarDialogComponent, DeleteDialogComponent, AddTopicDialogComponent, AddLanguageDialogComponent, ViewConflictDialogComponent],
  declarations: [EditCalendarDialogComponent, DeleteDialogComponent, AddTopicDialogComponent, AddLanguageDialogComponent, ViewConflictDialogComponent],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    EditCalendarDialogComponent,
    AddTopicDialogComponent,
    DeleteDialogComponent,
    AddLanguageDialogComponent,
      ViewConflictDialogComponent
  ],
})
export class DialogsModule { }