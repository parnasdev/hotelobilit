import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import {SwiperModule} from "swiper/angular";
import { TourModule } from '../tour/tour.module';
import { StoreComponent } from './store/store.component';
import { MaterialModule } from '../common-project/persianDatePickerAdapter/material.module';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    IndexComponent,
    HeaderComponent,
    FooterComponent,
    StoreComponent,
    LoadingComponent
  ],exports:[ LoadingComponent],
  imports: [
    CommonModule,
    SwiperModule,
    MaterialModule,
    TourModule,
    StoreRoutingModule,
  ]
})
export class StoreModule { }
