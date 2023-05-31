import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationRoutingModule } from './reservation-routing.module';
import { ListComponent } from './list/list.component';
import { ReserveInfoComponent } from './reserve-info/reserve-info.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MaterialModule} from "../common-project/persianDatePickerAdapter/material.module";
import {CommonProjectModule} from "../common-project/common-project.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';
import { PipesModule } from "../common-project/pipes/pipes.module";

@NgModule({
    declarations: [
        ListComponent,
        ReserveInfoComponent
    ],
    imports: [
        CommonModule,
        ReservationRoutingModule,
        FormsModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        NgxPaginationModule,
        MaterialModule,
        CommonProjectModule,
        MatSelectModule,
        PipesModule
    ]
})
export class ReservationModule { }
