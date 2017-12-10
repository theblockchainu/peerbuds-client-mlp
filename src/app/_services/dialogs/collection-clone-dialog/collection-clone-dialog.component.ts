import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-collection-clone-dialog',
  templateUrl: './collection-clone-dialog.component.html',
  styleUrls: ['./collection-clone-dialog.component.scss']
})
export class CollectionCloneDialogComponent implements OnInit {

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

}
