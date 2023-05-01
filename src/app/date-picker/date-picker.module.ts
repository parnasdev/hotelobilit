import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePickerRoutingModule } from './date-picker-routing.module';
import { MainPickerComponent } from './main-picker/main-picker.component';
import { PrsDatePickerComponent } from './prs-date-picker/prs-date-picker.component';


@NgModule({
  declarations: [MainPickerComponent, PrsDatePickerComponent],
  imports: [
    CommonModule,
    DatePickerRoutingModule
  ]
})
export class DatePickerModule { }
