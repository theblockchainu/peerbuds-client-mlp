import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { LiveSessionDialogComponent } from './live-session-dialog/live-session-dialog.component';
import { MultiselectTopicDialogComponent } from './multiselect-topic-dialog/multiselect-topic-dialog.component';

import { VerifyIdDialogComponent } from './verify-id-dialog/verify-id-dialog.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { IdPolicyDialogComponent } from './id-policy-dialog/id-policy-dialog.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { VerifyPhoneDialogComponent } from './verify-phone-dialog/verify-phone-dialog.component';

import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(public dialog: MdDialog
    ) { }

    public openSignup() {
        let dialogRef: MdDialogRef<SignupComponentDialog>;

        dialogRef = this.dialog.open(SignupComponentDialog);

        return dialogRef.afterClosed();
    }

    public openLogin() {
        let dialogRef1: MdDialogRef<LoginComponentDialog>;

        dialogRef1 = this.dialog.open(LoginComponentDialog);

        return dialogRef1.afterClosed();
    }
    public addCard() {
        let dialogRef4: MdDialogRef<AddCardDialogComponent>;

        dialogRef4 = this.dialog.open(AddCardDialogComponent, {
            width: '610px',
            height: '380px'
        });
        return dialogRef4.afterClosed();
    }
    public openIdVerify() {
        let dialogRef5: MdDialogRef<VerifyIdDialogComponent>;

        dialogRef5 = this.dialog.open(VerifyIdDialogComponent, {
            width: '60vw',
            height: '95vh'
        });
        return dialogRef5.afterClosed();
    }
    public openEmailVerify() {
        let dialogRef6: MdDialogRef<VerifyEmailDialogComponent>;

        dialogRef6 = this.dialog.open(VerifyEmailDialogComponent, {
            width: '650px',
            height: '600px'
        });
        return dialogRef6.afterClosed();
    }
    public openIdPolicy() {
        let dialogRef7: MdDialogRef<IdPolicyDialogComponent>;

        dialogRef7 = this.dialog.open(IdPolicyDialogComponent, {
            width: '500px',
            height: '600px'
        });
        return dialogRef7.afterClosed();
    }

    public openVideo() {
        let dialogRef8: MdDialogRef<VideoDialogComponent>;

        dialogRef8 = this.dialog.open(VideoDialogComponent, {
            width: '700px',
            height: '420px'
        });
        return dialogRef8.afterClosed();
    }
    public openPhoneVerify() {
        let dialogRef9: MdDialogRef<VerifyPhoneDialogComponent>;

        dialogRef9 = this.dialog.open(VerifyPhoneDialogComponent, {
            width: '500px',
            height: '600px'
        });
        return dialogRef9.afterClosed();
    }

    public openFollowTopicDialog(type, searchTopicURL) {
        let dialogRef5: MdDialogRef<MultiselectTopicDialogComponent>;

        dialogRef5 = this.dialog.open(MultiselectTopicDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true,
                width: '50vw',
                height: '70vh'
            }
        );
        dialogRef5.componentInstance.data = {
            searchUrl: searchTopicURL,
            selected: []
        };

        return dialogRef5.afterClosed();
    }

    /**
     * startLiveSession
     */
    public startLiveSession() {
        let dialogRef5: MdDialogRef<LiveSessionDialogComponent>;

        dialogRef5 = this.dialog.open(LiveSessionDialogComponent, {
            width: '100vw',
            height: '100vh'
        });
        return dialogRef5.afterClosed();
    }


}
