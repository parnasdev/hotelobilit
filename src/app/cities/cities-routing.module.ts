import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { CityListComponent } from './city-list/city-list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'child/:parent',
    component: CityListComponent
  },
  {
    path: 'add',
    component: AddComponent
  }, 
  {
    path: 'edit/:id',
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitiesRoutingModule { }
