import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { SharedModule } from '../_shared/_shared.module';
import { ProfileComponent } from './profile.component';

import { ProfileRoutingModule } from './profile-routing.module';
import { MdTabsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    MdTabsModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
