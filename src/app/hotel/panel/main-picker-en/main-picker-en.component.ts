import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { DatesResDTO } from 'src/app/Core/Models/tourDTO';
import { ConfirmPricingModalComponent } from '../confirm-pricing-modal/confirm-pricing-modal.component';
import { environment } from 'src/environments/environment';
import { RatingResDTO, ratigListReqDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
import { ConfirmPricingModalEnComponent } from '../confirm-pricing-modal-en/confirm-pricing-modal-en.component';
import {SessionService} from "../../../Core/Services/session.service";

@Component({
  selector: 'prs-main-picker-en',
  templateUrl: './main-picker-en.component.html',
  styleUrls: ['./main-picker-en.component.scss']
})
export class MainPickerEnComponent implements OnInit {
  @Input() hotelID = 0;
  @Input() pricingType = '0';
  @Input() selected_boardtype = 'B.B';
  @Input() currency=''

  @Input() agency_id =  33;


  @Input() room: roomDTO | null = {
    Adl_capacity: 0,
    age_child: 0,
    isDisable: false,
    chd_capacity: 0,
    room_type_id: 0,
    has_coefficient: false,
    coefficient: 0,
    id: 0,
    online_reservation: false,
    room_type: '',
    name: '',
    is_twin_count: false,
    extra_bed_count: 0
  };


  standardTwinId = environment.TWIN_ROOM_ID;
  standardTwinCoefficient = 0
  isLoading = false;
  moment: any = moment;
  month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysOfMonth: any[] = []
  currentMonths: any[] = []
  currentYears: any[] = []
  stDate: any = null;
  enDate: any = null;
  req!: ratigListReqDTO;
  pricesData!: RatingResDTO
  selectedDates: any[] = [];
  constructor(public service: CalenderServices,
    public dialog: MatDialog,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public checkError: ErrorsService,
    public api: PostApiService,
              public session:SessionService,

              public message: MessageService,) {

    }

  ngOnInit(): void {
    // @ts-ignore
    this.currentMonths = [+moment().format('MM'), +(moment().add(1, 'months').format('MM'))]
    // @ts-ignore
    this.currentYears = [+moment().format('YYYY'), +(moment().add(1, 'months').format('YYYY'))]
    this.generateCalendar();
  }

  generateCalendar() {
    let start1 = moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'YYYY/MM/DD').startOf('month');
    let end1 = moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'YYYY/MM/DD').endOf('month');
    let start2 = moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'YYYY/MM/DD').startOf('month')
    let end2 = moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'YYYY/MM/DD').endOf('month')

    const dates = [...this.fixDates(start1, end1), ...this.fixDates(start2, end2)]
    this.daysOfMonth = this.fillObject(dates)
    this.getHotelRates()
  }

  enumerateDaysBetweenDates(startDate: string, endDate: string) {
    if (startDate && endDate) {
      var dates = [];
      var currDate = moment(startDate).startOf('day');
      var lastDate = moment(endDate).startOf('day');
      dates.push(moment(currDate.clone().toDate()).format('YYYY/MM/DD'));

      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format('YYYY/MM/DD'));
      }
      dates.push(moment(lastDate.clone().toDate()).format('YYYY/MM/DD'));
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

  getHotelRates() {
    this.isLoading = true;
    this.req = {
      fromDate: moment(this.getFirstAndLastDates()[0]).format('YYYY-MM-DD'),
      toDate: moment(this.getFirstAndLastDates()[1]).format('YYYY-MM-DD'),
      hotelId: +this.hotelID,
      roomId: this.room ? +this.room.id : 0,
      boardType: this.selected_boardtype,
      agency_id: this.session.getRole() === 'admin' || this.session.getRole() === 'programmer' || this.session.getRole() === 'hamnavazAdmin' ?  +this.agency_id : null,

    }
    this.api.ratingList(this.req).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.pricesData = res.data;
        this.standardTwinCoefficient = this.getTwinCoefficient();

        this.daysOfMonth.forEach(item => {
          item.data = this.isExistOnPriceList(item.dateEn)
        });
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }


  getTwinCoefficient() {
    let result = 0
    this.pricesData.hotel.rooms?.forEach((item: any) => {
      if (item.room_type_id === this.standardTwinId) {
        result = item.coefficient
      }
    })
    return result
  }


  returnString(str1:any,str2:any){
    let booked=` booked:${str1}`
    let reserving=` reserving:${str2}`
    return booked + '  |  ' + reserving
  }

  fillObject(dates: any = []) {
    let result: any[] = [];
    dates.forEach((date: any) => {
      const object = {
        dateFa: moment(date).isValid() ? date : '',
        dateEn: moment(date).isValid() ? moment(date, 'YYYY/MM/DD').format('YYYY/MM/DD') : '',
        isHoliday: moment(date, 'YYYY/MM/DD').weekday() === 5,
        isDisabled: this.isBefore(date),
        isValid: moment(date).isValid(),
        data: this.isExistSelectedDates(date)
      }
      result.push(object);
    })
    return result;
  }

  isBefore(date: any) {
    let d = moment(date, 'YYYY/MM/DD').format('YYYY/MM/DD');
    let today = moment(new Date()).format('YYYY/MM/DD');
    return moment(d).isBefore(today)
  }


  onDateClicked(item: any) {
    if (this.pricingType === '0') {
      this.normalClickType(item,false)
    } else {
      if ((this.room ? this.room.room_type_id : 0) === this.standardTwinId) {
        this.normalClickType(item,false)
      } else {
        if(!this.room?.is_twin_count) {
          this.normalClickType(item,true)
        }

        // this.coefficientClickType(item)
      }
    }
  }
  getPriceLabel(item: any): string {
    if (item) {
      let price = 0;
      if (this.room?.room_type_id !== this.standardTwinId) {
        price = item.price;
      } else {
        price = item.price
        // if(this.pricingType === '1') {
        //   price = item.price / 2
        // } else {
        //   price = item.price
        // }
      }
      let currency_code=this.currency? this.currency : item.currency_code;

      if (currency_code === 'toman') {
        if (price.toString().length > 6) {
          return Intl.NumberFormat('en').format(price / 1000000) + ' ' + 'm t'
        } else if (price.toString().length > 3) {
          return Intl.NumberFormat('en').format(price / 1000) + ' ' + 'h t'
        } else {
          return Intl.NumberFormat('en').format(price) + 't'
        }
      } else if (currency_code === 'dollar') {
        return Intl.NumberFormat('en').format(price) + 'dollar'
      } else if (currency_code === 'euro') {
        return Intl.NumberFormat('en').format(price) + 'euro'
      } else {
        return Intl.NumberFormat('en').format(price) + 'derham'
      }
    } else {
      return '---'
    }
  }

  normalClickType(item: any,isJustRoomCount:boolean) {
    if (!this.stDate && !this.enDate) {
      this.stDate = item
    } else if (this.stDate && !this.enDate) {

      if (moment(item.dateFa).isBefore(moment(this.stDate.dateFa))) {
        this.message.custom('The selected date is invalid')
        this.stDate = null
      } else {
        this.enDate = item
        this.getSelectedDates();
        if (this.selectedDates.length <= 30) {
          this.confirmPricing(isJustRoomCount);
        } else {
          this.message.custom('The number of selected days should not be more than 30 days')
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
    return [+moment(this.currentYears[0] + '/' + this.currentMonths[0] + '/1', 'YYYY/MM/DD').add(num, 'months').format(format), +(moment(this.currentYears[1] + '/' + this.currentMonths[1] + '/1', 'YYYY/MM/DD').add(num, 'months').format(format))]
  }

  changeMonth(num = 1) {
    this.currentYears = this.getFixedDates(num, 'YYYY')
    this.currentMonths = this.getFixedDates(num, 'MM')
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

  confirmPricing(isJustRoomCount:boolean): void {
    const dialog = this.dialog.open(ConfirmPricingModalEnComponent, {
      width: '60%',
      data: {
        checkin: this.stDate,
        checkout: this.enDate,
        roomID: this.room ? this.room.id : 0,
        room: this.room,
        hotelID: this.hotelID,
        type: +this.pricingType,
        bedCount: this.room?.extra_bed_count,
        currency_code: this.pricesData.hotel.user_currency_code === 'NOTSET' ? this.pricesData.hotel.currency_code:this.pricesData.hotel.user_currency_code,
        isJustRoomCount : isJustRoomCount,
        board_type:this.selected_boardtype

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


  isExistOnPriceList(item: any): any {
    if (item && item !== '') {
      const y: any = moment(item).format('YYYY/MM/DD')

      if (this.daysOfMonth.length > 0) {
        let result = this.pricesData.rates.filter((x: any) => y === moment(x.date).format('YYYY/MM/DD'))
        return result.length > 0 ? {
          available_room_count: result[0].available_room_count,
          created_at: result[0].created_at,
          currency_code: result[0].currency_code,
          date: result[0].date,
          checkin_base: result[0].checkin_base,
          deleted_at: result[0].deleted_at,
          extra_bed_count: result[0].extra_bed_count,
          extra_price: result[0].extra_price,
          id: result[0].id,
          offer_extra_price: result[0].offer_extra_price,
          offer_price: result[0].offer_price,
          total_room_count: result[0].total_room_count,
          price: result[0].price,
          room_id: result[0].room_id,
          reserving_room_count:result[0].reserving_room_count,
          chd_w_price:result[0].chd_w_price,
          booked_room_count:result[0].booked_room_count,
          user_currency_code: this.pricesData?.hotel?.user_currency_code,

          updated_at: result[0].updated_at,
          user_id: result[0].user_id
        } : null;
      }
    } else {
      return null
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
