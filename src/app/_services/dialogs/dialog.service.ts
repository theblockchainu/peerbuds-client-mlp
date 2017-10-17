import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { ForgotpwdComponentDialog } from './forgot-pwd-dialog/forgot-pwd-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { LiveVideoDialogComponent } from './live-video-dialog/live-video-dialog.component';

import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(public dialog: MdDialog) { }

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

    public openForgotPwd() {
        let dialogRef3: MdDialogRef<ForgotpwdComponentDialog>;

        dialogRef3 = this.dialog.open(ForgotpwdComponentDialog);

        return dialogRef3.afterClosed();
    }

    public addCard() {
        let dialogRef4: MdDialogRef<AddCardDialogComponent>;

        dialogRef4 = this.dialog.open(AddCardDialogComponent, {
            width: '610px',
            height: '380px'
        });
        return dialogRef4.afterClosed();
    }

    /**
     * startLiveSession
     */
    public startLiveSession() {
        let dialogRef5: MdDialogRef<LiveVideoDialogComponent>;

        dialogRef5 = this.dialog.open(LiveVideoDialogComponent, {
            width: '100vw',
            height: '100vh'
        });
        return dialogRef5.afterClosed();
    }


}
