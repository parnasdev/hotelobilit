import { Component, Inject, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DateItemDTO } from '../new-date-picker-select/new-date-picker-select.component';

@Component({
  selector: 'prs-new-date-picker-mobile',
  templateUrl: './new-date-picker-mobile.component.html',
  styleUrls: ['./new-date-picker-mobile.component.scss']
})
export class NewDatePickerMobileComponent implements OnInit {
  years: DateItemDTO[] = [];
  months: DateItemDTO[] = [];
  days: DateItemDTO[] = [];
  dayNM: DateItemDTO = { title: 0, isDisabled: false };
  monthNM: DateItemDTO = { title: 0, isDisabled: false };
  yearNM: DateItemDTO = { title: 0, isDisabled: false };

  minMonth: number = 1;
  maxMonth: number = 12

  minDay: number = 1;
  maxDay: number = 31


  constructor(private _bottomSheetRef: MatBottomSheetRef<NewDatePickerMobileComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { lang: string, title: string, step: number, minDate: string, maxDate: string },) {

  }

  ngOnInit(): void {

    // this.dayNM = { title: moment(this.data.minDate).day(), isDisabled: false };
    // this.monthNM = { title: moment(this.data.minDate).month(), isDisabled: false };
    // this.yearNM = { title: moment(this.data.minDate).year(), isDisabled: false }
    this.generateYear()
    this.generateMonths()
    this.generateDays()
  }

  generateYear() {
    this.years = []
    let min = +this.data.minDate.split('-')[0]
    let max = +this.data.maxDate.split('-')[0]
  
    
    
    for (let i = min; i < max + 1; i++) {
      this.years.push({ title: i, isDisabled: false });
    }
  }

  generateMonths() {
    this.months = [];
    for (let i = 1; i < 12 + 1; i++) {
      if (i >= this.minMonth && i <= this.maxMonth) {
        this.months.push({ title: i, isDisabled: false });
      } else {
        this.months.push({ title: i, isDisabled: true });
      }
    }
  }

  close() {
    this._bottomSheetRef.dismiss()
  }

  generateDays() {
    this.days = []
    for (let i = 1; i < 31 + 1; i++) {
      if (i >= this.minDay && i <= this.maxDay) {
        this.days.push({ title: i, isDisabled: false });
      } else {
        this.days.push({ title: i, isDisabled: true });
      }
    }

  }


  onDaySelected(day: DateItemDTO) {
    this.dayNM = day
    // this._bottomSheetRef.dismiss(this.yearNM.title + '/' +
    //   this.monthNM.title +
    //   '/' + this.dayNM.title);


    if (this.data.step === 3) {
      this._bottomSheetRef.dismiss({ step: this.data.step, title: this.dayNM.title });
    }
  }
  onYearSelected(year: DateItemDTO) {
    this.yearNM = year
    if (this.yearNM.title === moment(this.data.minDate).year()) {
      this.minMonth = moment(this.data.minDate).month() + 1
    } else if (this.yearNM.title === moment(this.data.maxDate).year()) {
      this.maxMonth = moment(this.data.maxDate).month() + 1
    } else {
    }
    if (this.data.step === 1) {
      this._bottomSheetRef.dismiss({ step: this.data.step, title: this.yearNM.title });
    }

  }
  onMonthSelected(month: DateItemDTO) {
    this.monthNM = month
    if (this.monthNM.title === moment(this.data.minDate).month() + 1) {
      this.minDay = +this.data.minDate.split('-')[2]
    } else if (this.monthNM.title === moment(this.data.maxDate).month() + 1) {
      this.maxDay = +this.data.maxDate.split('-')[2]
    } else { }
    if (this.data.step === 2) {
      this._bottomSheetRef.dismiss({ step: this.data.step, title: this.monthNM.title });
    }
  }

}
