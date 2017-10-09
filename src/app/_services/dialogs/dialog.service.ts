import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { ForgotpwdComponentDialog } from './forgot-pwd-dialog/forgot-pwd-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';


import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(public dialog: MatDialog) { }

    public openSignup() {
        let dialogRef: MatDialogRef<SignupComponentDialog>;

        dialogRef = this.dialog.open(SignupComponentDialog);

        return dialogRef.afterClosed();
    }

    public openLogin() {
        let dialogRef1: MatDialogRef<LoginComponentDialog>;

        dialogRef1 = this.dialog.open(LoginComponentDialog);

        return dialogRef1.afterClosed();
    }

    public forgotPwd() {
        let dialogRef3: MatDialogRef<ForgotpwdComponentDialog>;

        dialogRef3 = this.dialog.open(ForgotpwdComponentDialog);

        return dialogRef3.afterClosed();
    }

    public addCard() {
        let dialogRef4: MatDialogRef<AddCardDialogComponent>;

        dialogRef4 = this.dialog.open(AddCardDialogComponent, {
            width: '610px',
            height: '380px'
        });

        return dialogRef4.afterClosed();
    }

}
