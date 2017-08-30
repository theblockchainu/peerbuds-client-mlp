import { Observable } from 'rxjs/Rx';
import { EditCalendarDialog } from './edit.calendar.dialog.component';
// import { ViewConflictDialog } from './view.conflict.dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import {
  CalendarEvent
} from 'angular-calendar';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public editCalendar(collection, contents, events: CalendarEvent[], userId: string, startDate: Date, endDate: Date): Observable<boolean> {
        let dialogRef: MdDialogRef<EditCalendarDialog>;

        dialogRef = this.dialog.open(EditCalendarDialog);

        dialogRef.componentInstance.collection = collection;
        dialogRef.componentInstance.contents = contents;
        dialogRef.componentInstance.inpEvents = events;
        dialogRef.componentInstance.userId = userId;
        dialogRef.componentInstance.startDate = startDate;
        dialogRef.componentInstance.endDate = endDate;

        return dialogRef.afterClosed();
    }

    // public showConflicts(conflicts, id): Observable<boolean> {
    //     let dialogRef: MdDialogRef<ViewConflictDialog>;

    //     dialogRef = this.dialog.open(ViewConflictDialog);

    //     dialogRef.componentInstance.conflicts = conflicts;
    //     dialogRef.componentInstance.id = id;

    //     return dialogRef.afterClosed();

    // }
}
