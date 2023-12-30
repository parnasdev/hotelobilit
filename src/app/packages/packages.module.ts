import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { AddComponent } from './add/add.component';
import { CopyComponent } from './copy/copy.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../common-project/pipes/pipes.module';
import { CommonProjectModule } from '../common-project/common-project.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialModule } from '../common-project/persianDatePickerAdapter/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoomsComponent } from './rooms/rooms.component';
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};


@NgModule({
  declarations: [
    AddComponent,
     CopyComponent,
      EditComponent,
       ListComponent,
       RoomsComponent,

      ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DragDropModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MaterialModule,
    MatCheckboxModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CommonProjectModule,
    PipesModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
   ], providers: [provideEnvironmentNgxMask(maskConfigFunction)],

})
export class PackagesModule { }
