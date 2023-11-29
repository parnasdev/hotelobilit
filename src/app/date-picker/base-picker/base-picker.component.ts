import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'jalali-moment';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { DatesResDTO } from 'src/app/Core/Models/tourDTO';

@Component({
  selector: 'prs-base-picker',
  templateUrl: './base-picker.component.html',
  styleUrls: ['./base-picker.component.scss']
})
export class BasePickerComponent implements OnInit, OnChanges {
  @Output() result = new EventEmitter()
  @Input() type = 'single';
  @Input() inCommingDate: any
  @Input() dateLise: DatesResDTO[] = []
  isLoading = false;
  moment: any = moment;
  month = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  daysOfMonth: any[] = []
  currentMonths: any[] = []
  currentYears: any[] = []
  stDate: any = null;
  enDate: any = null;
  selectedDates: any[] = [];
  constructor(public service: CalenderServices,
    public dialog: MatDialog,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public message: MessageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incommingDates']) {
      if (this.type === 'multiple') {
        this.stDate = this.inCommingDate.fromDate;
        this.enDate = this.inCommingDate.toDate;
        this.getSelectedDates();
      } else {
        this.stDate = this.inCommingDate.fromDate;
        this.enDate = null;
      }
    }
  }
  ngOnInit(): void {
    // @ts-ignore
    this.currentMonths = [+moment().format('jMM'), +(moment().add(1, 'jmonths').format('jMM'))]
    // @ts-ignore
    this.currentYears = [+moment().format('jYYYY'), +(moment().add(1, 'jmonths').format('jYYYY'))]
    this.generateCalendar();
  }

  enumerateDaysBetweenDates(startDate: string, endDate: string) {
    if (startDate && endDate) {
      var dates = [];
      var currDate = moment(startDate).startOf('day');
      var lastDate = moment(endDate).startOf('day');
      dates.push(moment(currDate.clone().toDate()).format('jYYYY/jMM/jDD'));

      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format('jYYYY/jMM/jDD'));
      }
      dates.push(moment(lastDate.clone().toDate()).format('jYYYY/jMM/jDD'));
      return dates;
    } else {
      return [];
    }
  };


  fixDates(startof: any, endOf: any) {
    const days = this.enumerateDaysBetweenDates(startof, endOf)
    let weekOfFirstDay = moment(startof).weekday() + 1;
    for (let i = 0; i < weekOfFirstDay; i++) {
      days.unshift('')
    }
    let indexOfLatestDay = days.length;
    for (let i = indexOfLatestDay; i < 42; i++) {
      days.push('')
    }
    return days;
  }

  generateCalendar() {
    let start1 = moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'jYYYY/jMM/jDD').startOf('jmonth');
    let end1 = moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'jYYYY/jMM/jDD').endOf('jmonth');
    let start2 = moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'jYYYY/jMM/jDD').startOf('jmonth')
    let end2 = moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'jYYYY/jMM/jDD').endOf('jmonth')

    // console.log(this.fixDates(start2, end2))
    const dates = [...this.fixDates(start1, end1), ...this.fixDates(start2, end2)]
    this.daysOfMonth = this.fillObject(dates)
  }


  fillObject(dates: any = []) {
    let result: any[] = [];
    dates.forEach((date: any) => {
      const object = {
        dateFa: moment(date).isValid() ? date : '',
        dateEn: moment(date).isValid() ? moment(date, 'jYYYY/jMM/jDD').format('YYYY/MM/DD') : '',
        isHoliday: moment(date, 'jYYYY/jMM/jDD').weekday() === 5,
        isDisabled: this.isBefore(date) || !this.isExistDateList(moment(date).isValid() ? moment(date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD') : ''),
        isValid: moment(date).isValid(),
      }
      result.push(object);
    })
    return result;
  }

  isExistDateList(date: string) {
    if (this.dateLise.length > 0) {
      if (date) {
        let result = this.dateLise.filter(x => x.date === date)
        return result.length > 0;
      } else {
        return false
      }

    } else {
      return true
    }
  }

  isBefore(date: any) {
    let d = moment(date, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
    let today = moment(new Date()).format('YYYY/MM/DD');
    return moment(d).isBefore(today)
  }


  onDateClicked(item: any) {
    if (this.type === 'multiple') {
      if (!this.stDate && !this.enDate) {
        this.stDate = item
      } else if (this.stDate && !this.enDate) {

        if (moment(item.dateFa).isBefore(moment(this.stDate.dateFa))) {
          this.message.custom('تاریخ انتخابی نامعتبر است')
          this.stDate = null
        } else {
          this.enDate = item
          this.result.emit({ fromDate: this.stDate, toDate: this.enDate })
          this.getSelectedDates();
          if (this.selectedDates.length <= 14) {
          } else {
            this.message.custom('تعداد روزهای انتخابی نباید بیشتر از ۱۴ روز باشد')
            this.clearParams()
          }
        }
      } else {
        this.selectedDates = []
        this.stDate = item
        this.enDate = null
      }
    } else {
      this.result.emit({ fromDate: item, toDate: '' })

    }
  }

  getSelectedDates() {
    this.selectedDates = this.enumerateDaysBetweenDates(this.stDate?.dateEn, this.enDate?.dateEn)
  }


  getFixedDates(num = 1, format: string) {
    // @ts-ignore
    return [+moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'jYYYY/jMM/jDD').add(num, 'jmonths').format(format), +(moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'jYYYY/jMM/jDD').add(num, 'jmonths').format(format))]
  }

  changeMonth(num = 1) {
    this.currentYears = this.getFixedDates(num, 'jYYYY')
    this.currentMonths = this.getFixedDates(num, 'jMM')
    this.generateCalendar()
  }

  getColorItem(item: any): any {
    if (item.dateFa === this.stDate?.dateFa) {
      return '#fcd2d8'
    } else if (item.dateFa === this.enDate?.dateFa) {
      return '#fca2af'
    } else {
      ''
    }
  }





  getFirstAndLastDates() {
    let startDate: any = null;
    let endDate: any = null;
    for (let i = 0; i < this.daysOfMonth.length; i++) {
      if (this.daysOfMonth[i].isValid) {
        startDate = this.daysOfMonth[i].dateEn;
      }
    }
    for (let i = this.daysOfMonth.length - 1; i > 0; i--) {
      if (this.daysOfMonth[i].isValid) {
        endDate = this.daysOfMonth[i].dateEn;
      }
    }
    return [endDate, startDate]
  }


  clearParams(): void {
    this.selectedDates = []
    this.stDate = null
    this.enDate = null
  }
}
