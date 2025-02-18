import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SperatorPipe} from "./sperator.pipe";
import {SafeHtmlPipe} from "./safe-html.pipe";
import { TourStatusFilterPipe } from './tour-status-filter.pipe';
import { RoundPipe } from './round.pipe';
import { OrderingPipe } from './ordering.pipe';
import { CityKeywordPipe } from './city-keyword.pipe';
import { OriginCityPipe } from './origin-city.pipe';
import { ConvertDatePipe } from './convert-date.pipe';
import { HotelListKeywordPipe } from './hotel-list-keyword.pipe';
import { SeparatorPipe } from './separator.pipe';
import { TimeFixerPipe } from './time-fixer.pipe';
import { ConvertDateTimePipe } from './convert-date-time.pipe';



@NgModule({
  declarations: [SperatorPipe,SafeHtmlPipe,SeparatorPipe, TourStatusFilterPipe, RoundPipe, OrderingPipe, CityKeywordPipe, OriginCityPipe, ConvertDatePipe, HotelListKeywordPipe, TimeFixerPipe, ConvertDateTimePipe],
    exports: [
        SperatorPipe,
        SafeHtmlPipe,
        TourStatusFilterPipe,
        RoundPipe,
        OrderingPipe,
        CityKeywordPipe,
        ConvertDateTimePipe,
        TimeFixerPipe,
        OriginCityPipe, ConvertDatePipe, SeparatorPipe
    ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
