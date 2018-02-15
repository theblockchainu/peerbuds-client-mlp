import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFooterComponent } from './app-footer.component';
import { SharedModule } from '../_shared/_shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AppFooterComponent
  ],
  exports: [AppFooterComponent]
})
export class AppFooterModule { }
