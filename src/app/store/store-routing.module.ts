import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'hotel',
    loadChildren: () => import('../hotel/hotel.module').then(m => m.HotelModule)
  },
  {
    path: 'tour',
    loadChildren: () => import('../tour/tour.module').then(m => m.TourModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
