import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./list/list.component";
import { AddComponent } from "./add/add.component";
import { EditComponent } from "./edit/edit.component";
import { AgencyUsersComponent } from './agency-users/agency-users.component';

const routes: Routes = [

  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: 'add/:parent',
    component: AddComponent,
  },
  {
    path: 'edit/:userId',
    component: EditComponent,
  },
  {
    path: 'edit/:userId/:parent',
    component: EditComponent,
  },
  {
    path: ':id',
    component: AgencyUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
