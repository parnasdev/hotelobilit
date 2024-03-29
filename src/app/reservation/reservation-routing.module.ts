import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ReserveInfoComponent } from './reserve-info/reserve-info.component';
import {FlightReservationListComponent} from "../transfer-rate/flight-reservation-list/flight-reservation-list.component";

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: ':reserve',
    component: ReserveInfoComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
