import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { IndexComponent } from './index/index.component';
import { IndexPhilComponent } from './index-philosophy/index-philosophy.component';
import {
    MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule,
    MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule, 
    IndexComponent,
    IndexPhilComponent,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [IndexComponent]
})
export class DefaultModule { }
