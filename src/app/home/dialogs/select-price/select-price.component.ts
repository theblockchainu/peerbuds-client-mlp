import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {CookieUtilsService} from '../../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-select-price',
  templateUrl: './select-price.component.html',
  styleUrls: ['./select-price.component.scss']
})
export class SelectPriceComponent implements OnInit {

  public userCurrency = 'USD';

  constructor(
    public dialogRef: MdDialogRef<SelectPriceComponent>,
    private _cookieService: CookieUtilsService,
    @Inject(MD_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.userCurrency = this._cookieService.getValue('currency').length === 3 ? this._cookieService.getValue('currency') : 'USD';
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.data);
    });
  }

}
