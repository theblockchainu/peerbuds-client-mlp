import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftSidebarRoutingModule } from './left-sidebar-routing.module';
import { LeftSidebarComponent } from './left-sidebar.component';
import { MdSidenavModule, MdIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LeftSidebarRoutingModule,
      MdSidenavModule,
      MdIconModule
  ],
  declarations: [LeftSidebarComponent],
  exports: [
    LeftSidebarComponent
  ]
})
export class LeftSidebarModule { }
