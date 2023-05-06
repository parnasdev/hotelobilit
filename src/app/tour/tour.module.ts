import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { ChooseRoomAndFlightComponent } from './choose-room-and-flight/choose-room-and-flight.component';
import { SearchComponent } from './search/search.component';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { CommonProjectModule } from '../common-project/common-project.module';
import { ReactiveFormsModule } from '@angular/forms';
import {SwiperModule} from "swiper/angular";


@NgModule({
  declarations: [
    HotelListComponent,
    ChooseRoomAndFlightComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    TourRoutingModule,
    DatePickerModule,
    ReactiveFormsModule,
    CommonProjectModule,
    SwiperModule,
  ],exports:[SearchComponent]
})
export class TourModule { }
