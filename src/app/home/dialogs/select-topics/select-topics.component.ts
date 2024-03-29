import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-topics',
  templateUrl: './select-topics.component.html',
  styleUrls: ['./select-topics.component.scss']
})
export class SelectTopicsComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<SelectTopicsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.data);
    });
  }

}
