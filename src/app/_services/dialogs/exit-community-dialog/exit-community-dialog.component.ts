import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {CommunityService} from '../../community/community.service';

@Component({
  selector: 'app-exit-community-dialog',
  templateUrl: './exit-community-dialog.component.html',
  styleUrls: ['./exit-community-dialog.component.scss']
})
export class ExitCommunityDialogComponent implements OnInit {

    constructor(public dialogRef: MdDialogRef<ExitCommunityDialogComponent>
        , @Inject(MD_DIALOG_DATA) public data: any,
                private _communityService: CommunityService,
                private snackBar: MdSnackBar) { }

    ngOnInit() {
    }

    dropOut() {
        this._communityService.removeParticipant(this.data.communityId, this.data.userId).subscribe((response) => {
            if (response)
                this.dialogRef.close(true);
        }, err => {
            this.snackBar.open('Couldn&#39;t cancel membership', 'Retry').onAction().subscribe(res => {
                this.dropOut();
            });
        });
    }

}
