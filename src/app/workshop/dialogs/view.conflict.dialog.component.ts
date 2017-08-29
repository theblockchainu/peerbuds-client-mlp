import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdButtonModule } from '@angular/material';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import _ from 'lodash';

@Component({
    selector: 'app-view-conflict-dialog',
    templateUrl: './view.conflict.dialog.component.html',
    styleUrls: ['./view.conflict.dialog.component.scss']
})

export class ViewConflictDialog implements OnInit {

    public conflicts: FormGroup;
    public computedConflict;

    constructor(public dialogRef1: MdDialogRef<ViewConflictDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.data);
        for (const conflict of this.data.conflicts.ranges) {
            if (conflict.previous.eventId === this.data.id) {
                this.data.computedConflict.push({
                    event: conflict.previous,
                    conflictWith: conflict.current
                });
            }
            else {
                this.data.computedConflict.push({
                    event: conflict.current,
                    conflictWith: conflict.previous
                });
            }
        }
        this.conflicts = this._fb.group({
        });
    }

}
