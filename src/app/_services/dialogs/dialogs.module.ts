import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { ForgotpwdComponentDialog } from './forgot-pwd-dialog/forgot-pwd-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { VerifyIdDialogComponent } from './verify-id-dialog/verify-id-dialog.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { IdPolicyDialogComponent } from './id-policy-dialog/id-policy-dialog.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { VerifyPhoneDialogComponent } from './verify-phone-dialog/verify-phone-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, DeleteDialogComponent, AddCardDialogComponent, VerifyIdDialogComponent, VerifyEmailDialogComponent, IdPolicyDialogComponent, VideoDialogComponent, VerifyPhoneDialogComponent],
  declarations: [SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, DeleteDialogComponent, AddCardDialogComponent, VerifyIdDialogComponent, VerifyEmailDialogComponent, IdPolicyDialogComponent, VideoDialogComponent, VerifyPhoneDialogComponent],
  providers: [
    DialogsService
  ],
  entryComponents: [
    SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, AddCardDialogComponent, VerifyIdDialogComponent, VerifyEmailDialogComponent, IdPolicyDialogComponent, VideoDialogComponent, VerifyPhoneDialogComponent
  ],
})
export class DialogsModule { }
