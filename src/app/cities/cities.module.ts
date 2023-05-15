import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitiesRoutingModule } from './cities-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonProjectModule } from '../common-project/common-project.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { CityListComponent } from './city-list/city-list.component';


@NgModule({
  declarations: [
    AddComponent, 
    EditComponent,
    ListComponent,
    CityListComponent],
  imports: [
    CommonModule,
    CitiesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    CommonProjectModule,
    NgxPaginationModule,
    CommonProjectModule,
  ]
})
export class CitiesModule { }
