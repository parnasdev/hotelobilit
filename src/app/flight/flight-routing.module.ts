import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { CompositionComponent } from './composition/composition.component';
import { CompositionListComponent } from './composition-list/composition-list.component';
import { FlightReservationListComponent } from '../transfer-rate/flight-reservation-list/flight-reservation-list.component';
import { ReserveFlightListComponent } from './reserve-flight-list/reserve-flight-list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  }, {
    path: 'add',
    component: AddComponent
  }, {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'composition',
    component: CompositionComponent
  },
  {
    path: 'composition-list',
    component: CompositionListComponent
  },
  {
    path: 'reserves',
    component: ReserveFlightListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
