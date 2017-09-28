import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { PeersComponent } from './peers/peers.component';

import { MdTabsModule } from '@angular/material';
import { HomefeedComponent } from './homefeed/homefeed.component';
import { SharedModule } from '../_shared/_shared.module';
import { SelectTopicsComponent } from './dialogs/select-topics/select-topics.component';
import { SelectPriceComponent } from './dialogs//select-price/select-price.component';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MdTabsModule,
    SharedModule,
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.threeBounce,
        backdropBackgroundColour: 'rgba(0,0,0,0)',
        backdropBorderRadius: '0px',
        primaryColour: '#33bd9e',
        secondaryColour: '#ff5b5f',
        tertiaryColour: '#ff6d71'
    })
  ],
  declarations: [HomeComponent, WorkshopsComponent, PeersComponent, HomefeedComponent, SelectTopicsComponent, SelectPriceComponent],
  providers: [],
  bootstrap: [SelectTopicsComponent, SelectPriceComponent]
})
export class HomeModule { }
