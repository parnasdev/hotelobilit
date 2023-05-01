import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferRateRoutingModule } from './transfer-rate-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from '../common-project/persianDatePickerAdapter/material.module';
import { CommonProjectModule } from '../common-project/common-project.module';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../common-project/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToolsModule } from '../tools/tools/tools.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IConfig } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    TransferRateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MaterialModule,
    CommonProjectModule,
    MatCheckboxModule,
    NgxPaginationModule,
    MatInputModule,
    MatFormFieldModule,
    PipesModule,
  ]
})
export class TransferRateModule { }
