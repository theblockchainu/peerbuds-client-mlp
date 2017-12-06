import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  public action;

  constructor(public dialogRef: MdDialogRef<DeleteDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.action = data;
  }

  ngOnInit() {
  }

}
