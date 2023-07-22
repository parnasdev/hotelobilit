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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { CopyComponent } from './copy/copy.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { HotelPanelModule } from '../hotel/panel/hotel-panel.module';
import { SetServiceComponent } from './set-service/set-service.component';
import { SingleEditComponent } from './single-edit/single-edit.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    CopyComponent,
    SetServiceComponent,
    SingleEditComponent,
    FilterPopupComponent
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
    MatIconModule,
    NgxPaginationModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    PipesModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    HotelPanelModule,
    MatTooltipModule
  ], providers: [provideEnvironmentNgxMask(maskConfigFunction)],
})
export class TransferRateModule { }
