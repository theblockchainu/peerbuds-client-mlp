import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-experience-video',
  templateUrl: './experience-video.component.html',
  styleUrls: ['./experience-video.component.scss']
})
export class ExperienceVideoComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ExperienceVideoComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
