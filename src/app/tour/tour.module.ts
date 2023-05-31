import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { ChooseRoomAndFlightComponent } from './choose-room-and-flight/choose-room-and-flight.component';
import { SearchComponent } from './search/search.component';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { CommonProjectModule } from '../common-project/common-project.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SwiperModule } from "swiper/angular";
import { PipesModule } from "../common-project/pipes/pipes.module";
import { CompleteReservationComponent } from './complete-reservation/complete-reservation.component';
import { PassengersComponent } from './passengers/passengers.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        HotelListComponent,
        ChooseRoomAndFlightComponent,
        SearchComponent,
        PassengersComponent,
        CompleteReservationComponent
    ],
    exports: [SearchComponent],
    imports: [
        CommonModule,
        TourRoutingModule,
        SwiperModule,
        FormsModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        NgxPaginationModule,
        CommonProjectModule,
        PipesModule,
        MatInputModule,
        MatDatepickerModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ]
})
export class TourModule { }
