import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonProjectModule } from '../common-project/common-project.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../common-project/persianDatePickerAdapter/material.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    NgxPaginationModule,
    MatDialogModule,
    CommonProjectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MaterialModule,
    MatSelectModule,

  ]
})
export class RolesModule { }
