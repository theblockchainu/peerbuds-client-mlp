import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { ForgotpwdComponentDialog } from './forgot-pwd-dialog/forgot-pwd-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { VerifyIdDialogComponent } from './verify-id-dialog/verify-id-dialog.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { IdPolicyDialogComponent } from './id-policy-dialog/id-policy-dialog.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';

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

    public openForgotPwd(){
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
    public openIdVerify() {
        let dialogRef5: MdDialogRef<VerifyIdDialogComponent>;

        dialogRef5 = this.dialog.open(VerifyIdDialogComponent, {
            width: '800px',
            height: '700px'
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
            width: '500px',
            height: '600px'
        });
        return dialogRef8.afterClosed();
    }

}
