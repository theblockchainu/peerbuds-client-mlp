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
import { LiveVideoDialogComponent } from './live-video-dialog/live-video-dialog.component';
import { TwilioServicesService } from '../twlio_services/twilio-services.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, DeleteDialogComponent, AddCardDialogComponent, LiveVideoDialogComponent],
  declarations: [SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, DeleteDialogComponent, AddCardDialogComponent, LiveVideoDialogComponent],
  providers: [
    DialogsService,
    TwilioServicesService
  ],
  entryComponents: [
    SignupComponentDialog, LoginComponentDialog, ForgotpwdComponentDialog, AddCardDialogComponent, LiveVideoDialogComponent
  ],
})
export class DialogsModule { }
