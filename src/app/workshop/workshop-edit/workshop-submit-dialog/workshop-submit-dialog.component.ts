import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workshop-submit-dialog',
  templateUrl: './workshop-submit-dialog.component.html',
  styleUrls: ['./workshop-submit-dialog.component.scss']
})
export class WorkshopSubmitDialogComponent implements OnInit {

  constructor(
      public dialogRef: MdDialogRef<WorkshopSubmitDialogComponent>,
      private router: Router
  ) { }

  ngOnInit() {
  }

  public closeDialog() {
    this.dialogRef.close('close');
    this.router.navigate(['console', 'teaching', 'workshops']);
  }

}
