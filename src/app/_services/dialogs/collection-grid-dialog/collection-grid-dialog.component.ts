import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app.config';
@Component({
  selector: 'app-collection-grid-dialog',
  templateUrl: './collection-grid-dialog.component.html',
  styleUrls: ['./collection-grid-dialog.component.scss']
})
export class CollectionGridDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<CollectionGridDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private router: Router,
    public config: AppConfig) { }

  ngOnInit() {
    console.log(this.data);
  }

  public openCollectionPage(id) {
    this.dialogRef.close(id);
  }

}
