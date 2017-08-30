import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar-component.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
