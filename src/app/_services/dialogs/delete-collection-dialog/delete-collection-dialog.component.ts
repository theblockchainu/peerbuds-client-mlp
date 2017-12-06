import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CollectionService } from '../../collection/collection.service';

@Component({
  selector: 'app-delete-collection-dialog',
  templateUrl: './delete-collection-dialog.component.html',
  styleUrls: ['./delete-collection-dialog.component.scss']
})
export class DeleteCollectionDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<DeleteCollectionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _collectionService: CollectionService) { }

  ngOnInit() {
  }

  public delete() {
    this._collectionService.deleteCollection(this.data.id).subscribe(res => {
      if (res) {
        console.log(res);
        this.dialogRef.close(true);
      }
    }, err => {
      this.dialogRef.close(false);
    });
  }

}
