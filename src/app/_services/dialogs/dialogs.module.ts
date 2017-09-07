import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsService } from './dialog.service';
import { SharedModule } from '../../_shared/_shared.module';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [SignupComponentDialog,LoginComponentDialog],
  declarations: [SignupComponentDialog,LoginComponentDialog],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    SignupComponentDialog,LoginComponentDialog
  ],
})
export class DialogsModule { }