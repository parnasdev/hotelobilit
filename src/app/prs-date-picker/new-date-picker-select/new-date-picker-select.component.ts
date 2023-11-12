import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import * as moment from 'jalali-moment';
import { ErrorsService } from 'src/app/Core/Services/errors.service';

export interface DateItemDTO {
  title: number;
  isDisabled: boolean;
}
@Component({
  selector: 'prs-new-date-picker-select',
  templateUrl: './new-date-picker-select.component.html',
  styleUrls: ['./new-date-picker-select.component.scss']
})
export class NewDatePickerSelectComponent implements OnInit, OnChanges {
  @Input() minDate = '1300-1-1'
  @Input() maxDate = '1500-12-29'
  @Input() title = 'انتخاب تاریخ'
  @Input() incommingDate = '';
  @Input() lang = 'fa'
  @Output() sendDate = new EventEmitter()
  years: DateItemDTO[] = [];
  months: DateItemDTO[] = [];
  days: DateItemDTO[] = [];

  dayFC = new FormControl()
  monthFC = new FormControl()
  yearFC = new FormControl()

  minMonth: number = 1;
  maxMonth: number = 12

  minDay: number = 1;
  maxDay: number = 31

  constructor(public errorsService: ErrorsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incommingDate'].firstChange) {

      let date = ''
      if (this.lang === 'fa') {
        date = moment(changes['incommingDate'].currentValue).format('jYYYY-jM-jD')
      } else {
        date = changes['incommingDate'].currentValue

      }

      this.dayFC.setValue(+date.split('-')[2])
      this.monthFC.setValue(+date.split('-')[1])
      this.yearFC.setValue(+date.split('-')[0])
    }
  }

  ngOnInit(): void {
    this.generateYear()
    this.generateMonths()
    this.generateDays()
  }


  setPlaceHolder(sel: MatSelect, title: string) {
    if (sel.value === undefined) {
      sel.placeholder = title;
    }
  }

  generateYear() {
    for (let i = moment(this.minDate).weekYear(); i < moment(this.maxDate).weekYear() + 1; i++) {
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


  onDaySelected() {
    this.emitDates()

  }
  onYearSelected() {
    if (+this.yearFC.value === moment(this.minDate).year()) {
      this.minMonth = moment(this.minDate).month() + 1
    } else if (+this.yearFC.value === moment(this.maxDate).year()) {
      this.maxMonth = moment(this.maxDate).month() + 1
    } else {
    }

    this.emitDates()

  }
  onMonthSelected() {
    if (+this.monthFC.value === moment(this.minDate).month() + 1) {
      this.minDay = +this.minDate.split('-')[2]
    } else if (+this.monthFC.value === moment(this.maxDate).month() + 1) {
      this.maxDay = +this.maxDate.split('-')[2]
    } else {
    }
    // this.generateDays();
    this.emitDates()
  }


  emitDates() {
    if ((this.dayFC.value !== 0 && this.dayFC.value)&& (this.monthFC.value !== 0 && this.monthFC.value) && (this.yearFC.value !== 0 && this.yearFC.value)) {
      // 
      this.sendDate.emit(this.yearFC.value + '-' + this.monthFC.value + '-' + this.dayFC.value)
    }
  }
}
