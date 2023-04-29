import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'jalali-moment';
import { SperatorPipe } from 'src/app/common-project/pipes/sperator.pipe';
import { HotelApiService } from 'src/app/Core/Https/hotel-api.service';
import { HotelRatesReqDTO, HotelRatesResDTO } from 'src/app/Core/Models/hotelDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ConfirmPricingModalComponent } from '../confirm-pricing-modal/confirm-pricing-modal.component';

@Component({
  selector: 'prs-main-picker',
  templateUrl: './main-picker.component.html',
  styleUrls: ['./main-picker.component.scss']
})
export class MainPickerComponent implements OnInit {
  @Input() hotelID = 0;
  @Input() roomID = 0;
  moment: any = moment;
  month = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  daysOfMonth: any[] = []
  currentMonths: any[] = []
  currentYears: any[] = []
  stDate: any = null;
  enDate: any = null;
  pricesData: HotelRatesResDTO[] = [];
  selectedDates: any[] = [];
  constructor(public service: CalenderServices,
    public dialog: MatDialog,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public hotelApi: HotelApiService,
    public message: MessageService,) { }
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

    this.getHotelRates()
  }


  fillObject(dates: any = []) {
    let result: any[] = [];


    dates.forEach((date: any) => {
      const object = {
        dateFa: moment(date).isValid() ? date : '',
        dateEn: moment(date).isValid() ? moment(date, 'jYYYY/jMM/jDD').format('YYYY/MM/DD') : '',
        isHoliday: moment(date, 'jYYYY/jMM/jDD').weekday() === 5,
        isDisabled: this.isBefore(date),
        isValid: moment(date).isValid(),
        data: this.isExistSelectedDates(date)
      }
      result.push(object);
    })
    return result;
  }

  isBefore(date: any) {
    let d = this.service.convertDate(date, 'en');
    let today = moment(new Date()).format('jYYYY/jMM/jDD');
    return moment(d).isBefore(today)
  }






  onDateClicked(item: any) {
    if (!this.stDate && !this.enDate) {
      this.stDate = item
    } else if (this.stDate && !this.enDate) {

      if (moment(item.dateFa).isBefore(moment(this.stDate.dateFa))) {
        this.message.custom('تاریخ انتخابی نامعتبر است')
        this.stDate = null
      } else {
        this.enDate = item
        this.getSelectedDates();
        if (this.selectedDates.length <= 14) {
          this.confirmPricing()
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
    } else if (this.isExistSelectedDates(item)) {
      return '#fff5f6'
    } else {
      ''
    }
  }



  isExistSelectedDates(item: any): any {
    if (this.selectedDates.length > 0) {
      return this.selectedDates.some((x) => item.dateFa === x);
    }
  }


  confirmPricing(): void {
    const dialog = this.dialog.open(ConfirmPricingModalComponent, {
      width: '30%',
      data: {
        checkin: this.stDate,
        checkout: this.enDate,
        roomID: this.roomID,
        hotelID: this.hotelID
      }
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.getHotelRates()
      } else {

      }
      this.clearParams()
    })
  }


  getPriceLabel(item: any): string {
    if (item) {
      if (item.rate === 1) {
        if (item.price.toString().length > 6) {
          return Intl.NumberFormat('en').format(item.price / 1000000) + ' ' + 'م ت'
        } else if (item.price.toString().length > 3) {
          return Intl.NumberFormat('en').format(item.price / 1000) + ' ' + 'ه ت'
        } else {
          return Intl.NumberFormat('en').format(item.price) + 'ت'

        }

      } else if (item.rate === 3) {
        return item.price + 'دلار'
      } else if (item.rate === 2) {
        return item.price + 'یورو'
      } else {
        return item.price + 'درهم'
      }
    } else {
      return '---'
    }


  }


  getHotelRates() {

    const req: HotelRatesReqDTO = {
      fromDate: moment(this.getFirstAndLastDates()[0]).format('YYYY-MM-DD'),
      toDate: moment(this.getFirstAndLastDates()[1]).format('YYYY-MM-DD'),
    }
    this.hotelApi.getHotelRates(+this.hotelID, this.roomID, req).subscribe((res: any) => {
      if (res.isDone) {
        this.pricesData = res.data
        this.daysOfMonth.forEach(item => {
          item.data = this.isExistOnPriceList(item.dateEn)
        });
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.errorService.check(error)
    })
  }


  isExistOnPriceList(item: any): any {
    // const y: any = moment(item).format('YYYY/MM/DD')
    // if (this.daysOfMonth.length > 0) {
    //   let result = this.pricesData.filter((x) => y === moment(x.checkin).format('YYYY/MM/DD'))
    //   return result.length > 0 ? { price: result[0].price, rate: result[0].rate , capacity: result[0].capacity} : null;
    // }
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
