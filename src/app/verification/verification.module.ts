import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { UploadDocsComponent } from './upload-docs/upload-docs.component';

@NgModule({
  imports: [
    CommonModule,
    VerificationRoutingModule
  ],
  declarations: [UploadDocsComponent]
})
export class VerificationModule { }
