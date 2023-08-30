import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { CopyComponent } from './copy/copy.component';
import { SetServiceComponent } from './set-service/set-service.component';
import { SingleEditComponent } from './single-edit/single-edit.component';
import {FlightReservationListComponent} from "./flight-reservation-list/flight-reservation-list.component";

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'reserves',
    component: FlightReservationListComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  }, {
    path: 'single-edit/:id',
    component: SingleEditComponent
  },
  {
    path: 'copy/:id',
    component: CopyComponent
  },
  {
    path: 'serviceRate/:id',
    component: SetServiceComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRateRoutingModule { }
