import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { CollectionService } from '../../collection/collection.service';
import { CookieUtilsService } from '../../cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-cancel-collection-dialog',
  templateUrl: './cancel-collection-dialog.component.html',
  styleUrls: ['./cancel-collection-dialog.component.scss']
})
export class CancelCollectionDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<CancelCollectionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _collectionService: CollectionService,
    private _cookieUtilsService: CookieUtilsService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  public cancel() {
    const body = {
      'isCanceled': true,
      'canceledBy': this._cookieUtilsService.getValue('userId'),
      'status': 'cancelled',
    };
    this._collectionService.patchCollection(this.data.id, body).subscribe(res => {
      if (res) {
        this.dialogRef.close(res.json());
      }
    }, err => {
      this.snackBar.open('Workshop Couldn&#39;t be Cancelled', 'Retry', {
        duration: 800
      }).onAction().subscribe(res => {
        this.cancel();
      });
    });
  }

}
