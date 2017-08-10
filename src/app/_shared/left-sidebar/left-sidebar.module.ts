import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftSidebarRoutingModule } from './left-sidebar-routing.module';
import { LeftSidebarComponent } from './left-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    LeftSidebarRoutingModule
  ],
  declarations: [LeftSidebarComponent],
  exports: [
    LeftSidebarComponent
  ]
})
export class LeftSidebarModule { }
