import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransferRoutingModule} from './transfer-routing.module';
import {CommonProjectModule} from "../common-project/common-project.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { NgxPaginationModule } from 'ngx-pagination';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { CopyComponent } from './copy/copy.component';


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent,
    CopyComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    CommonProjectModule,
    NgxPaginationModule,
  ]
})
export class TransferModule {
}
