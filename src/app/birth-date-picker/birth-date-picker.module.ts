import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseBirthDateComponent } from './base-birth-date/base-birth-date.component';
import { BirthDatePickerComponent } from './birth-date-picker/birth-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';



@NgModule({
  declarations: [BaseBirthDateComponent, BirthDatePickerComponent],
  exports: [BaseBirthDateComponent, BirthDatePickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    FormsModule
  ]
})
export class BirthDatePickerModule { }
