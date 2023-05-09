import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { CopyComponent } from './copy/copy.component';

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
  },{
    path: 'copy/:id',
    component: CopyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRateRoutingModule { }
