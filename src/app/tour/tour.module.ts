import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { ChooseRoomAndFlightComponent } from './choose-room-and-flight/choose-room-and-flight.component';
import { SearchComponent } from './search/search.component';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { CommonProjectModule } from '../common-project/common-project.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SwiperModule} from "swiper/angular";
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    HotelListComponent,
    ChooseRoomAndFlightComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    TourRoutingModule,
    // DatePickerModule,
    ReactiveFormsModule,
    CommonProjectModule,
    SwiperModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,

  ],exports:[SearchComponent]
})
export class TourModule { }
