import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
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
import { AgencyUsersComponent } from './agency-users/agency-users.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    EditComponent,
    AgencyUsersComponent,
  ],exports: [],
    imports: [
        CommonModule,
        UserRoutingModule,
        FormsModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        MatTooltipModule,
        NgxPaginationModule,
        MaterialModule,
        CommonProjectModule,
        MatSelectModule,
    ]
})
export class UserModule { }
