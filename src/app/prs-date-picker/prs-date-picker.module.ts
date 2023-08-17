import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerInputComponent } from './date-picker-input/date-picker-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { NewDatePickerSelectComponent } from './new-date-picker-select/new-date-picker-select.component';
import { NewDatePickerMobileComponent } from './new-date-picker-mobile/new-date-picker-mobile.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NewDatePickerPopupComponent } from './new-date-picker-popup/new-date-picker-popup.component';



@NgModule({
  declarations: [
    DatePickerInputComponent,
    NewDatePickerSelectComponent,
    NewDatePickerMobileComponent,
    NewDatePickerPopupComponent,
  ],
  exports: [
    DatePickerInputComponent,
    NewDatePickerSelectComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatOptionModule,
    FormsModule
  ]
})
export class PrsDatePickerModule { }
