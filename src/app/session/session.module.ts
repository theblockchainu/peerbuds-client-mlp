import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionEditComponent } from './session-edit/session-edit.component';

import { SharedModule } from '../_shared/_shared.module';
@NgModule({
  imports: [
    CommonModule,
    SessionRoutingModule,
    SharedModule
  ],
  declarations: [SessionEditComponent]
})
export class SessionModule { }
