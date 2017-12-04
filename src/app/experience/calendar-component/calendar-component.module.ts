import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar-component.component';
import { MdIconModule } from '@angular/material';
import { CalendarModule } from 'angular-calendar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdIconModule,
        CalendarModule.forRoot()
    ],
    exports: [
        CalendarComponent,
    ],
    declarations: [
        CalendarComponent,
    ],
    providers: [],
})
export class CalendarCustomModule { }
