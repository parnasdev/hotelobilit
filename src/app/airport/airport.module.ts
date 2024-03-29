import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirportRoutingModule } from './airport-routing.module';
import {CommonProjectModule} from "../common-project/common-project.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { NgxPaginationModule } from 'ngx-pagination';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    AirportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    CommonProjectModule,
    NgxPaginationModule,
    CommonProjectModule,
  ]
})
export class AirportModule { }
