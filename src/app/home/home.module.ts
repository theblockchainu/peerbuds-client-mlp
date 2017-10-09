import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { PeersComponent } from './peers/peers.component';

import { MatTabsModule } from '@angular/material';
import { HomefeedComponent } from './homefeed/homefeed.component';
import { SharedModule } from '../_shared/_shared.module';
import { SelectTopicsComponent } from './dialogs/select-topics/select-topics.component';
import { SelectPriceComponent } from './dialogs/select-price/select-price.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatTabsModule,
    SharedModule
  ],
  declarations: [HomeComponent, WorkshopsComponent, PeersComponent, HomefeedComponent, SelectTopicsComponent, SelectPriceComponent],
  providers: [],
  bootstrap: [SelectTopicsComponent, SelectPriceComponent]
})
export class HomeModule { }
