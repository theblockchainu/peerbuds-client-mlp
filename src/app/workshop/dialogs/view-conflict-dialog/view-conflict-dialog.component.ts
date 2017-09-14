import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdButtonModule } from '@angular/material';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';

@Component({
    selector: 'app-view-conflict-dialog',
    templateUrl: './view-conflict-dialog.component.html',
    styleUrls: ['./view-conflict-dialog.component.scss']
})

export class ViewConflictDialogComponent implements OnInit {

    public conflicts: FormGroup;

    constructor(public dialogRef1: MdDialogRef<ViewConflictDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.data);
        this.conflicts = this._fb.group({
        });
    }

    public continueAnyways() {
        this.dialogRef1.close();
    }

    public dropCalendar(startDate, endDate) {
        this.dialogRef1.close({startDate, endDate});
    }

}