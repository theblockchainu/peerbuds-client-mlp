import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-id-policy-dialog',
  templateUrl: './id-policy-dialog.component.html',
  styleUrls: ['./id-policy-dialog.component.scss']
})
export class IdPolicyDialogComponent implements OnInit {

  public action;

  constructor(public dialogRef: MdDialogRef<IdPolicyDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
