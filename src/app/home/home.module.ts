import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { PeersComponent } from './peers/peers.component';

import { MdTabsModule } from '@angular/material';
import { HomefeedComponent } from './homefeed/homefeed.component';
import { SharedModule } from '../_shared/_shared.module';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MdTabsModule,
    SharedModule
  ],
  declarations: [HomeComponent, WorkshopsComponent, PeersComponent, HomefeedComponent],
  providers: []
})
export class HomeModule { }
