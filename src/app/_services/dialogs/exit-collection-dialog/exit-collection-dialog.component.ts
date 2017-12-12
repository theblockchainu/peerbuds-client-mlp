import { Component, OnInit, Inject } from '@angular/core';
import { CollectionService } from '../../collection/collection.service';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-exit-collection-dialog',
  templateUrl: './exit-collection-dialog.component.html',
  styleUrls: ['./exit-collection-dialog.component.scss']
})
export class ExitCollectionDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ExitCollectionDialogComponent>
    , @Inject(MD_DIALOG_DATA) public data: any,
    private _collectionService: CollectionService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  dropOut() {
    this._collectionService.removeParticipant(this.data.collectionId, this.data.userId).subscribe((response) => {
      if (response)
        this.dialogRef.close(true);
    }, err => {
      this.snackBar.open('Couldn&#39;t Drop out', 'Retry').onAction().subscribe(res => {
        this.dropOut();
      });
    });
  }
}
