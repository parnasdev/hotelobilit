import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { ChooseRoomAndFlightComponent } from './choose-room-and-flight/choose-room-and-flight.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: ':city',
    component: HotelListComponent
  },
  {
    path: 'flight/:hotelID',
    component: ChooseRoomAndFlightComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourRoutingModule { }
