import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-workshop-video',
  templateUrl: './workshop-video.component.html',
  styleUrls: ['./workshop-video.component.scss']
})
export class WorkshopVideoComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<WorkshopVideoComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
