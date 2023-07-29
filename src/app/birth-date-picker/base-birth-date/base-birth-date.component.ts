import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet'
import { BirthDateDataService } from './birth-date-data.service';
@Component({
  selector: 'prs-base-birth-date',
  templateUrl: './base-birth-date.component.html',
  styleUrls: ['./base-birth-date.component.scss']
})
export class BaseBirthDateComponent implements OnInit {
  year: number = 0;
  month: string = 'فروردین';
  day: number = 0
  months: string[] = [];
  step = 1;
  constructor(public _bottomSheetRef: MatBottomSheetRef<BaseBirthDateComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { lang: string, type: string },
    public service: BirthDateDataService) {
    this.months = data.lang === 'fa' ? service.monthsFa : service.monthEn
  }

  ngOnInit(): void {
    this.service.generateYear(this.data.lang, this.data.type);
    this.service.generateDay();
  }

  onYearSelected(year: number): void {
    this.year = year
    this.step = 2
  }
  onMonthSelected(month: string): void {
    this.month = month
    this.step = 3
  }
  onDaySelected(day: number): void {
    this.day = day
    this._bottomSheetRef.dismiss(this.year + '/' +
      (this.data.lang === 'fa' ? this.service.getMonthFaNumber(this.month) : this.service.getMonthEnNumber(this.month)) +
      '/' + this.service.getDayLabel(this.day));
  }
}
