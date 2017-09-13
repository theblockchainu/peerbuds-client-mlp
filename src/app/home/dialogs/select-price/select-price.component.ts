import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-price',
  templateUrl: './select-price.component.html',
  styleUrls: ['./select-price.component.scss']
})
export class SelectPriceComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<SelectPriceComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.data);
    });
  }

}
