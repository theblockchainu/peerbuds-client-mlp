import { MdDialogRef, MdIconModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';

import { ContentService } from '../../_services/content/content.service';
import * as moment from 'moment';
import _ from 'lodash';

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
import { CustomDateFormatter } from '../workshop-page/custom-date-formatter.provider';

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
    selector: 'app-edit-calendar-dialog',
    templateUrl: './edit.calendar.dialog.component.html',
    styleUrls: ['./edit.calendar.dialog.component.scss'],
    providers: [
      {
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
      }
    ]
})
export class EditCalendarDialog implements OnInit {

    public title: string;
    public id: string;
    public inpEvents: CalendarEvent[];
    public userId: string;
    public startDate;
    public endDate;
    public duration;

    public daysOption;
    public weekDayOption = [
                            { value: 1, text: 'Monday'},
                            { value: 2, text: 'Tuesday'},
                            { value: 3, text: 'Wednesday'},
                            { value: 4, text: 'Thursday'},
                            { value: 5, text: 'Friday'},
                            { value: 6, text: 'Saturday'},
                            { value: 7, text: 'Sunday'}
                            ];
    public monthOption;
    public dateRepeat;

    public recurring: FormGroup;

    // Insights stats
    public startDay;
    public endDay;
    public recurringCount;

    // eventCalendar
    public eventCalendar;
    public results;

    // Calendar Start
    public dateClicked: boolean = false;
    public clickedDate;
    public eventsForTheDay;
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

    /**
     * Get array of days
     * @returns {Array}
     */
    public getDaysArray() {
        const days = [];
        for (let i = 0; i <= 30; i++) {
        days.push(i);
        }
        return days;
    }

    /**
     * Get array of months
     * @returns {Array}
     */
    public getMonthArray() {
        const months = [];
        for (let i = 0; i <= 15; i++) {
        months.push(i);
        }
        return months;
    }

    constructor(public dialogRef: MdDialogRef<EditCalendarDialog>,
        private _fb: FormBuilder,
        private _contentService: ContentService) {
    }
    public ngOnInit() {
        this.duration = moment.duration(moment(this.endDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(this.startDate, 'YYYY-MM-DD HH:mm:ss'))).asDays();
        this.daysOption = this.getDaysArray();
        this.events = this.inpEvents;
        this.monthOption = this.getMonthArray();
        //Get all the events for a user
        this._contentService.getEvents(this.userId)
        .subscribe((response) => {
            this.eventCalendar = response;
            console.log(response);
            this.sort();
            console.log(this.eventCalendar);
            this.results = this.overlap();
        });

        this.recurring = this._fb.group({
            repeatWorkshopGroupOption: ['', Validators.required],
            days: [2],
            weekdays: [1],
            daysRepeat: [2],
            monthsRepeat: [6],
            repeatTillOption: ['', Validators.required],
            dateRepeat: ['']
        });
    }

    public saveCalendar(): void {
    }

    public repeatFrequency(value) {
        switch (value) {
            case 'immediate':
                                this.startDay = this.endDate;
                                break;
            case 'days':
                                this.startDay = moment(this.endDate).add(+this.recurring.controls['days'].value, 'days');
                                break;
            case 'weekdays':
                                const isoWeekDay = this.recurring.controls['weekdays'].value;
                                if (moment().isoWeekday() <= isoWeekDay) {
                                    // then just give me this week's instance of that day
                                    this.startDay =  moment().isoWeekday(isoWeekDay);
                                } else {
                                    // otherwise, give me next week's instance of that day
                                    this.startDay = moment().add(1, 'weeks').isoWeekday(isoWeekDay);
                                }
                                break;
            default:
                                this.startDay = this.startDate;

        }
    }

    public repeatTill(value) {
        switch (value) {
            // case 'daysRepeat':
            //                     this.endDay = 
        }

    }

    public sort() {
        const sortedRanges = this.eventCalendar.sort((previous, current) => {
            // get the start date from previous and current
            const previousTime = moment(previous.startDateTime).toDate().getTime();
            const currentTime = moment(current.startDateTime).toDate().getTime();
            // if the previous is earlier than the current
            if (previousTime < currentTime) {
            return -1;
            }
            // if the previous time is the same as the current time
            if (previousTime === currentTime) {
            return 0;
            }
            // if the previous time is later than the current time
            return 1;
        });
        this.eventCalendar = sortedRanges;
    }

    public overlap() {
        const result = this.eventCalendar.reduce((result, current, idx, arr) => {
        // get the previous range
        if (idx === 0) { return result; }
        const previous = arr[idx - 1];
        // check for any overlap
        const previousEnd = moment(previous.endDateTime).toDate().getTime();
        const currentStart = moment(current.startDateTime).toDate().getTime();
        const overlap = (previousEnd >= currentStart);
        // store the result
        if (overlap) {
            // yes, there is overlap
            result.overlap = true;
            // store the specific ranges that overlap
            result.ranges.push({
            previous: previous,
            current: current
            });
        }
        return result;
        // seed the reduce
        }, {overlap: false, ranges: []});
        console.log(result);
        // return the final results
        return result;

    }

    // Modal
    public viewConflict() {
        // this.dialogsService
        // .showConflicts(this.results, this.id)
        // .subscribe();
    }

}
