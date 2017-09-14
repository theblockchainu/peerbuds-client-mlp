import { MdDialogRef, MdDialog, MdDialogConfig, MdIconModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';

import { ContentService } from '../../../_services/content/content.service';
import { CollectionService } from '../../../_services/collection/collection.service';
import * as moment from 'moment';
import _ from 'lodash';

import { ViewConflictDialogComponent } from '../view-conflict-dialog/view-conflict-dialog.component';

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
import { CustomDateFormatter } from '../../workshop-page/custom-date-formatter.provider';

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
    templateUrl: './edit-calendar-dialog.component.html',
    styleUrls: ['./edit-calendar-dialog.component.scss'],
    providers: [
      {
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
      }
    ]
})
export class EditCalendarDialogComponent implements OnInit {

    public collection;
    public contents;
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

    public recurringCalendar;

    // Insights stats
    public startDay;
    public endDay;
    public recurringCount = 0;
    public nextDays;

    // eventCalendar
    public eventCalendar = [];
    public results;
    public computedConflict = [];
    public removedEvents = [];
    public computedEventCalendar = [];

    // Calendar Start
    public dateClicked = false;
    public clickedDate;
    public eventsForTheDay = {};
    objectKeys = Object.keys;
    public view = 'month';

    public viewDate: Date = new Date();

    refresh: Subject<any> = new Subject();

    public modalData: {
        action: string;
        event: CalendarEvent;
    };

    events: CalendarEvent[] = [
    ];

    activeDayIsOpen = true;

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        this.eventsForTheDay = {};
        if (events.length === 0) {
          this.dateClicked = false;
          return;
        }
        else {
          this.dateClicked = true; // !this.dateClicked;
        }
        this.clickedDate = date;
        for (const event of events) {
          const titleCalIdArray = this.parseTitle(event.title);
          const calId = titleCalIdArray[1];
          const title = titleCalIdArray[0];
          if (!this.eventsForTheDay.hasOwnProperty(calId)) {
            this.eventsForTheDay[calId] = [{
                                          title: title,
                                          color: event.color,
                                          start: event.start,
                                          end:  event.end
                                          }];
          }
          else {
            this.eventsForTheDay[calId].push({
              title: title,
              color: event.color,
              start: event.start,
              end:  event.end
            });
          }
        }
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
        console.log(this.eventsForTheDay);
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

    public parseTitle(title) {
        return title.split(':');
    }

    constructor(public dialogRef: MdDialogRef<EditCalendarDialogComponent>,
        private _fb: FormBuilder,
        private _contentService: ContentService,
        private dialog: MdDialog,
        private _collectionService: CollectionService) {
    }
    public ngOnInit() {
        this.duration = moment.duration(moment(this.endDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(this.startDate, 'YYYY-MM-DD HH:mm:ss'))).asDays() + 1;
        this.daysOption = this.getDaysArray();
        this.events = this.inpEvents;
        this.monthOption = this.getMonthArray();
        //Get all the events for a user
        this._contentService.getEvents(this.userId)
        .subscribe((response) => {
            this.eventCalendar = [];
            this.eventCalendar = response;
        });
        this.recurring = this._fb.group({
            repeatWorkshopGroupOption: ['', Validators.required],
            days: [2],
            weekdays: [1],
            daysRepeat: [2],
            monthsRepeat: [6],
            repeatTillOption: ['', Validators.required],
            dateRepeat: [moment().add(1, 'M').toDate()]
        });
    }

    public saveCalendar(): void {
        this._collectionService.postCalendars(this.collection.id, this.recurringCalendar)
        .subscribe((response) => {
            this.dialogRef.close();
        });
    }

    public repeatFrequency(value) {
        this.computedEventCalendar = [];
        switch (value) {
            case 'immediate':
                                this.startDay = this.endDate;
                                break;
            case 'days':
                                this.startDay = moment(this.endDate).add(this.recurring.controls['days'].value, 'days').format('YYYY-MM-DD');
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
        this.repeatTill(this.recurring.value.repeatTillOption);
    }

    public repeatTill(value) {
        this.computedEventCalendar = [];
        const days = +this.recurring.controls['days'].value;
        const weekday = this.recurring.controls['weekdays'].value;
        const tillDate = this.recurring.controls['dateRepeat'].value;
        const start = this.startDay;
        const end = moment(this.startDay).add(this.duration, 'days');
        switch (value) {
            case 'daysRepeat':
                                this.recurringCalendar = [];
                                const freq = this.recurring.controls['daysRepeat'].value;
                                this.recurringCalendar.push({ startDate: moment(start).toDate().toISOString(), endDate: end.toDate().toISOString()});
                                for (let i = 1; i < freq; i++) {
                                    this.createCalendars(end, days, weekday);
                                }
                                break;
            case 'monthsRepeat':
                                this.recurringCalendar = [];
                                const months = this.recurring.controls['monthsRepeat'].value;
                                const futureMonth = moment(start).add(months, 'M');
                                const futureMonthEnd = moment(futureMonth).endOf('month');
                                this.recurringCalendar.push({ startDate: moment(start).toDate().toISOString(), endDate: end.toDate().toISOString()});
                                this.endDay = end;
                                while ( moment(this.endDay).isBefore(moment(futureMonth)) ) {
                                    this.createCalendars(this.endDay, days, weekday);
                                }
                                break;
            case 'dateRepeat':
                                this.recurringCalendar = [];
                                this.recurringCalendar.push({ startDate: moment(start).toDate().toISOString(), endDate: end.toDate().toISOString()});
                                this.endDay = end;
                                while (moment(this.endDay).isBefore(moment(tillDate))) {
                                    this.createCalendars(this.endDay, days, weekday);
                                }
                                break;
            default:
                                this.recurringCalendar = [];
        }
        this.nextDays = moment(this.endDay).diff(moment(this.startDay), 'days') + 1;
        this.computedEventCalendar = _.cloneDeep(this.eventCalendar);
        if (this.recurringCalendar.length > 0) {
            //Modify recurringCalendar and contents to look same like eventCalendar
            for (const calendar of this.recurringCalendar) {
                const startDate = moment(calendar.startDate).local().format('YYYY-MM-DD');
                const endDate = moment(calendar.endDate).local().format('YYYY-MM-DD');
                for (const content of this.contents) {
                    if (content.type === 'online') {
                    const contentStartDate = moment(startDate).add(content.schedules[0].startDay, 'days');
                    const contentEndDate = moment(contentStartDate).add(content.schedules[0].endDay, 'days');
                    this.computedEventCalendar.push(
                        {
                            collectionId: this.collection.id,
                            collectionName: this.collection.name,
                            collectionType: this.collection.type,
                            contentId: content.id,
                            contentName: content.title,
                            contentType: content.type,
                            endDateTime: moment(moment(contentEndDate).format('YYYY-MM-DD') + ' ' + this.extractTime(content.schedules[0].endTime)).toDate().toISOString(),
                            startDateTime: moment(moment(contentStartDate).format('YYYY-MM-DD') + ' ' + this.extractTime(content.schedules[0].startTime)).toDate().toISOString()
                        }
                    );
                    }
                }
            }
            this.sort();
            this.results = [];
            this.results = _.cloneDeep(this.overlap());
            // Remove other conflicts
            this.removedEvents = _.remove(this.results.ranges, (item) => {
                return moment(item.current.endDateTime, 'YYYY-MM-DD') < moment(this.recurringCalendar[0].startDate, 'YYYY-MM-DD');
            });
            this.computedConflict = [];
            for (const conflict of this.results.ranges) {
                if (conflict.previous.collectionId === this.collection.id) {
                    this.computedConflict.push({
                        event: conflict.previous,
                        conflictWith: conflict.current
                    });
                }
                else {
                    this.computedConflict.push({
                        event: conflict.current,
                        conflictWith: conflict.previous
                    });
                }
            }
            let newArr = [];
            newArr = _.filter(this.computedConflict, (element, index)  => {
                // tests if the element has a duplicate in the rest of the array
                for (index += 1; index < this.computedConflict.length; index += 1) {
                    if (_.isEqual(element, this.computedConflict[index])) {
                        return false;
                    }
                }
                return true;
            });
            this.computedConflict = [];
            this.computedConflict = _.cloneDeep(newArr);
        }
        this.recurringCount = this.recurringCalendar.length;
    }

    private extractDate(dateString: string) {
        return moment.utc(dateString).local().toDate();
    }

    private extractTime(dateString: string) {
        const time = moment.utc(dateString).local().format('HH:mm:ss');
        return time;
      }

    public createCalendars(end, days, weekday) {
        if (this.recurring.value.repeatWorkshopGroupOption === 'immediate') {
            this.recurringCalendar.push({ startDate: end.toDate().toISOString(), endDate: moment(end).add(this.duration, 'days').toDate().toISOString()});
            end = moment(end).add(this.duration, 'days').format('YYYY-MM-DD');
        }
        else if (this.recurring.value.repeatWorkshopGroupOption === 'days') {
            this.recurringCalendar.push({ startDate: moment(end).add(days, 'days').toDate().toISOString(), endDate: moment(end).add(this.duration + days, 'days').toDate().toISOString()});
            end = moment(end).add(this.duration + days, 'days').format('YYYY-MM-DD');
        }
        else if (this.recurring.value.repeatWorkshopGroupOption === 'weekdays') {
            if (moment(end).isoWeekday() <= weekday) {
                end = moment(end).isoWeekday(weekday);
            } else {
                // otherwise, give me next week's instance of that day
                end = moment(end).add(1, 'weeks').isoWeekday(weekday);
            }
            this.recurringCalendar.push({ startDate: end.toDate().toISOString(), endDate: moment(end).add(this.duration, 'days').toDate().toISOString()});
            end = moment(end).add(this.duration, 'days').format('YYYY-MM-DD');
        }
        this.endDay = end;
    }

    public sort() {
        const sortedRanges = this.computedEventCalendar.sort((previous, current) => {
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
        this.computedEventCalendar = [];
        this.computedEventCalendar = _.cloneDeep(sortedRanges);
    }

    public overlap() {
        const result = this.computedEventCalendar.reduce((result, current, idx, arr) => {
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
        const dialogRef = this.dialog.open(ViewConflictDialogComponent, {
            width: '50vw',
            height: '90vh',
            data: {
                conflicts: this.computedConflict,
                id: this.collection.id
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(this.recurringCalendar);
            for (let i = 0; i < this.recurringCalendar.length; i++) {
                if (moment(this.recurringCalendar[i].startDate) <= moment(result.startDate) && moment(this.recurringCalendar[i].endDate) >= moment(result.endDate)) {
                    this.recurringCalendar = _.remove(this.recurringCalendar, (item) => {
                        return item.startDate !== this.recurringCalendar[i].startDate && item.endDate !== this.recurringCalendar[i].endDate;
                    });
                }
            }
        });
    }

}
