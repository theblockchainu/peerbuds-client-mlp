import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { SubmitEntryComponent } from '../submit-entry/submit-entry.component';

@Component({
  selector: 'app-content-project',
  templateUrl: './content-project.component.html',
  styleUrls: ['./content-project.component.scss']
})
export class ContentProjectComponent implements OnInit {

  public noImage = 'assets/images/no-image.jpg';

  constructor(public config: AppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog
  ) { }
  ngOnInit() {
  }

  openSubmitEntryDialog(data: any) {
    const dialogRef = this.dialog.open(SubmitEntryComponent, {
      data: data,
      width: '660px'
    });
  }
}
