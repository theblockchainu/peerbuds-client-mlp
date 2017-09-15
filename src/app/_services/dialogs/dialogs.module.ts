import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { ForgotpwdComponentDialog } from './forgot-pwd-dialog/forgot-pwd-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [SignupComponentDialog,LoginComponentDialog,ForgotpwdComponentDialog],
  declarations: [SignupComponentDialog,LoginComponentDialog,ForgotpwdComponentDialog],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    SignupComponentDialog,LoginComponentDialog,ForgotpwdComponentDialog
  ],
})
export class DialogsModule { }
