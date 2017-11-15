import { Component, OnInit, Input, ViewChild, Renderer2 } from '@angular/core';
import { AppConfig } from '../../app.config';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogsService } from '../../_services/dialogs/dialog.service';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss']
})
export class ProfilePopupComponent implements OnInit {

  @Input() participant: any;
  @ViewChild('profilePic') profilePic;

  private dialogref: MdDialogRef<any>;

  constructor(public config: AppConfig,
    public dialog: MdDialog,
    private _dialogsService: DialogsService
  ) { }

  ngOnInit() {
  }

  openPriceDialog(): void {
    const config = {
      hasBackdrop: false,
      width: '250px',
      height: '200px',
      data: this.participant,
      position: {
        top: (this.profilePic.nativeElement.getBoundingClientRect().top - 200) + 'px',
        left: (this.profilePic.nativeElement.getBoundingClientRect().right) + 'px'
      }
    };
    this.dialogref = this._dialogsService.openProfilePopup(config);
  }

  public closePriceDialog(): void {
    this.dialogref.close();
  }
}
