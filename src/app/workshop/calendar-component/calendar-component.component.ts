import { Component, OnInit } from '@angular/core';
import { MdDialogModule, MdButtonModule, MdIconModule } from '@angular/material';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';

import { DialogsService } from '../../workshop/dialogs/dialog.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar-component',
  templateUrl: './calendar-component.component.html',
  styleUrls: ['./calendar-component.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {

  // Calendar Start
  public dateClicked: boolean = false;
  public clickedDate;
  public eventsForTheDay;
  public headerTemplate = `<ng-template #headerTemplate>
                            <div class="cal-cell-row cal-header">
                            <div class="cal-cell" *ngFor="let day of days" [class.cal-past]="day.isPast" [class.cal-today]="day.isToday"
                                [class.cal-future]="day.isFuture"
                                [class.cal-weekend]="day.isWeekend"
                                [ngClass]="day.cssClass">RRR
                            </div>
                          </div>
                          </ng-template>`;

  public view: string = 'month';

  public viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  public modalData: {
    action: string;
    event: CalendarEvent;
  };

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.dateClicked = true; // !this.dateClicked;
    this.clickedDate = date;
    this.eventsForTheDay = events;
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  // Calendar Ends
  constructor() { }

  ngOnInit() {
  }

}
