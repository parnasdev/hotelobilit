import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import {SwiperModule} from "swiper/angular";

@NgModule({
  declarations: [
    IndexComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SwiperModule,
    StoreRoutingModule,
  ]
})
export class StoreModule { }
