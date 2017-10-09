import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftSidebarRoutingModule } from './left-sidebar-routing.module';
import { LeftSidebarComponent } from './left-sidebar.component';
import { MatSidenavModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LeftSidebarRoutingModule,
      MatSidenavModule,
      MatIconModule
  ],
  declarations: [LeftSidebarComponent],
  exports: [
    LeftSidebarComponent
  ]
})
export class LeftSidebarModule { }
