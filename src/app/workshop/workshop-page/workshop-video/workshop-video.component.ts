import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-workshop-video',
  templateUrl: './workshop-video.component.html',
  styleUrls: ['./workshop-video.component.scss']
})
export class WorkshopVideoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WorkshopVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
