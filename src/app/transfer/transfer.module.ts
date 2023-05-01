import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransferRoutingModule} from './transfer-routing.module';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {ListComponent} from './list/list.component';
import {CommonProjectModule} from "../common-project/common-project.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    CommonProjectModule
  ]
})
export class TransferModule {
}
