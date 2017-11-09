import { Observable } from 'rxjs/Rx';
import { EditCalendarDialogComponent } from './edit-calendar-dialog/edit-calendar-dialog.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AddLanguageDialogComponent } from './add-language-dialog/add-language-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import { LiveSessionDialogComponent } from '../../_services/dialogs/live-session-dialog/live-session-dialog.component';
import {
    CalendarEvent
} from 'angular-calendar';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public editCalendar(collection, contents, calendars, allItinerary, participants, events: CalendarEvent[], userId: string, startDate: Date, endDate: Date): Observable<boolean> {
        let dialogRef: MdDialogRef<EditCalendarDialogComponent>;

        dialogRef = this.dialog.open(EditCalendarDialogComponent, {
            width: '80vw',
            height: '95vh'}
        );

        dialogRef.componentInstance.collection = collection;
        dialogRef.componentInstance.contents = contents;
        dialogRef.componentInstance.calendars = calendars;
        dialogRef.componentInstance.allItenaries = allItinerary;
        dialogRef.componentInstance.participants = participants;
        dialogRef.componentInstance.inpEvents = events;
        dialogRef.componentInstance.userId = userId;
        dialogRef.componentInstance.startDate = startDate;
        dialogRef.componentInstance.endDate = endDate;

        return dialogRef.afterClosed();
    }

    public deleteCollection(action) {
        let dialogRef: MdDialogRef<DeleteDialogComponent>;

        dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.componentInstance.action = action;

        return dialogRef.afterClosed();

    }

    public addNewTopic() {
        let dialogRef: MdDialogRef<AddTopicDialogComponent>;

        dialogRef = this.dialog.open(AddTopicDialogComponent);

        return dialogRef.afterClosed();

    }

    public addNewLanguage() {
        let dialogRef: MdDialogRef<AddLanguageDialogComponent>;

        dialogRef = this.dialog.open(AddLanguageDialogComponent);

        return dialogRef.afterClosed();

    }

    /**
     * startLiveSession
     */
    public startLiveSession(data: any) {
        let dialogRef5: MdDialogRef<LiveSessionDialogComponent>;

        dialogRef5 = this.dialog.open(LiveSessionDialogComponent, {
            panelClass: 'my-full-screen-dialog',
            data: data
        });
        return dialogRef5.afterClosed();
    }
}
