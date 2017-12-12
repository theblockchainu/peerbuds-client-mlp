import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { CollectionService } from '../../collection/collection.service';

@Component({
  selector: 'app-delete-cohort-dialog',
  templateUrl: './delete-cohort-dialog.component.html',
  styleUrls: ['./delete-cohort-dialog.component.scss']
})
export class DeleteCohortDialogComponent implements OnInit {
  public deleteable: boolean;

  constructor(public dialogRef: MdDialogRef<DeleteCohortDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _collectionService: CollectionService,
    private snackBar: MdSnackBar) {

  }
  ngOnInit() {
  }

  public deleteCohort() {
    this._collectionService.deleteCalendar(this.data).subscribe(res => {
      if (res) {
        console.log(res);
        this.dialogRef.close(true);
      }
    }, err => {
      this.snackBar.open('Workshop Couldn&#39;t be deleted', 'Retry', {
      }).onAction().subscribe(res => {
        this.deleteCohort();
      });
    });
  }


}
