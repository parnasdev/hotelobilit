import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePickerRoutingModule } from './date-picker-routing.module';
import { MainPickerComponent } from './main-picker/main-picker.component';
import { PrsDatePickerComponent } from './prs-date-picker/prs-date-picker.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [MainPickerComponent, PrsDatePickerComponent],
  imports: [
    CommonModule,
    DatePickerRoutingModule,
    MatDialogModule,
  ], exports: [PrsDatePickerComponent]
})
export class DatePickerModule { }
