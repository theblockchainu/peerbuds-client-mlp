import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdButtonModule } from '@angular/material';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import _ from 'lodash';

@Component({
    selector: 'app-view-conflict-dialog',
    templateUrl: './view-conflict-dialog.component.html',
    styleUrls: ['./view-conflict-dialog.component.scss']
})

export class ViewConflictDialogComponent implements OnInit {

    public conflicts: FormGroup;
    public droppedCalendars = [];
    private proceedButtonText = 'Proceed with conflicts';

    constructor(public dialogRef1: MdDialogRef<ViewConflictDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) { }

    ngOnInit() {
        this.conflicts = this._fb.group({
        });
    }

    public undoDeleteCalendar(i) {
        this.data.conflicts[i]['markedForDelete'] = false;
        this.getProceedButtonText();
    }

    public deleteCalendar(i) {
        this.data.conflicts[i]['markedForDelete'] = true;
        this.getProceedButtonText();
    }

    public closeConflictDialog() {
        this.dialogRef1.close(this.data.conflicts);
    }

    public getProceedButtonText() {
        let forDelete = _.every(this.data.conflicts, ['markedForDelete', true]);
        if (forDelete) {
            this.proceedButtonText = 'Proceed';
        }
        else {
            this.proceedButtonText = 'Proceed with remaining conflicts';
        }
    }


}