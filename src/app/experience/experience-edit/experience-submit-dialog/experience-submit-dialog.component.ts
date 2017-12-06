import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-experience-submit-dialog',
  templateUrl: './experience-submit-dialog.component.html',
  styleUrls: ['./experience-submit-dialog.component.scss']
})
export class ExperienceSubmitDialogComponent implements OnInit {

  constructor(
      public dialogRef: MdDialogRef<ExperienceSubmitDialogComponent>,
      private router: Router
  ) { }

  ngOnInit() {
  }

  public closeDialog() {
    this.dialogRef.close('close');
    this.router.navigate(['console', 'teaching', 'experiences']);
  }

}
