import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';

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

}