import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { PeersComponent } from './peers/peers.component';

import { MdTabsModule } from '@angular/material';
import { HomefeedComponent } from './homefeed/homefeed.component';
import { SharedModule } from '../_shared/_shared.module';
import { SelectTopicsComponent } from './dialogs/select-topics/select-topics.component';
import { SelectPriceComponent } from './dialogs/select-price/select-price.component';
import { StickyModule } from 'ng2-sticky-kit';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MdTabsModule,
    SharedModule,
    StickyModule
  ],
  declarations: [HomeComponent, WorkshopsComponent, ExperiencesComponent, PeersComponent, HomefeedComponent, SelectTopicsComponent, SelectPriceComponent],
  providers: [],
  bootstrap: [SelectTopicsComponent, SelectPriceComponent]
})
export class HomeModule { }
