import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { RateDTO } from 'src/app/Core/Models/newPostDTO';
import {
  ReserveCheckingReqDTO,
  ReserveCreateDTO,
  ReservePassengerCreateDTO,
} from 'src/app/Core/Models/reserveDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { Location } from '@angular/common';
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPhoneComponent } from 'src/app/auth/confirm-phone/confirm-phone.component';
import { SessionService } from 'src/app/Core/Services/session.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import * as moment from 'jalali-moment';
import { CalenderServices } from 'src/app/Core/Services/calender-service';

@Component({
  selector: 'prs-complete-reservation',
  templateUrl: './complete-reservation.component.html',
  styleUrls: ['./complete-reservation.component.scss']
})
export class CompleteReservationComponent implements OnInit {
  isMobile = false;
  isDesktop = false;
  totalPrice = 0;
  isTablet = false;
  flightID = '';
  hotelID = '';
  showPassengers = true;
  isLoading = false;
ref_code: string = ''
  expired_time: string = ''
  isPrivacyCheck = false;

  req: ReserveCreateDTO = {
  reserves: [],
  reserver_full_name: '',
  reserver_phone: '',
  reserver_id_code: ''
  }
  flight:any;
  checkingReq!: ReserveCheckingReqDTO
  data: any
rooms: any[] = []
  finalRoomSelected: ReservePassengerCreateDTO[] = [];
  interval: any;
  seconds = 0;
  minutes = 20;

  nameFC = new FormControl();
  familyFC = new FormControl();

  reserver_phoneFC = new FormControl('', Validators.required);
  reserver_id_codeFC = new FormControl();
  formGroup: FormGroup = this.fb.group({
    reserver_id_code: this.reserver_id_codeFC,
    reserver_phone: this.reserver_phoneFC,
    nameFC: this.nameFC,
    familyFC: this.familyFC
  })

  constructor(public api: ReserveApiService,
    public message: MessageService,
    public mobileService: ResponsiveService,
    private _location: Location,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public publicService: PublicService,
    public session: SessionService,
    public calendarService: CalenderServices,
    public errorService: ErrorsService,
    public router: Router,
    public checkError: CheckErrorService,
    public route: ActivatedRoute) {
    this.isMobile = mobileService.isMobile()
    this.isTablet = mobileService.isTablet()
    this.isDesktop = mobileService.isDesktop()
  }

  ngOnInit(): void {
    this.hotelID = this.route.snapshot.paramMap.get('hotel') ?? ''
    this.flightID = this.route.snapshot.paramMap.get('flight') ?? ''

    this.checking();
  }


  setCheckingReq() {
    this.route.queryParams.subscribe(params => {
      this.checkingReq = {
        checkin: moment(params['checkin'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        checkout: moment(params['checkout'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        stayCount: params['stayCount'],
        hotel_id: +this.hotelID,
        flight_id: +this.flightID,
        rooms: JSON.parse(params['rooms'])
      }
    }
    );
  }


  getRoomData(result: any) {
    this.totalPrice = 0
    this.rooms.forEach(item => {
      item.passengers?.forEach((pass:any) => {
        this.totalPrice += (pass.price ?? 0);
      })
      if (item.id === result.id) {
        item.passengers = result.passengers;
        // item. = this.getRommTotalPrice(data.passengers, data.name)
      }
    })
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.seconds = 59;
        this.minutes--;
      } else {
        clearInterval(this.interval);
        this.minutes = 0
      }

      if (this.minutes === 0 && this.seconds === 0) {
        this.message.showMessageBig('زمان رزرو شما به اتمام رسید')
        this.router.navigateByUrl('/')
      }
    }, 1000);
  }
  formatter(n: number): string {
    return n > 9 ? ('' + n) : ('0' + n);
  }

  checking() {
    this.setCheckingReq()
    this.isLoading = true;
    this.api.checking(this.checkingReq).subscribe((res: any) => {
      if (res.isDone) {
        this.ref_code = res.data.ref_code;
        this.expired_time = res.data.expired_in_minutes
        this.minutes = +this.expired_time;
        this.startTimer();

        this.showReserve();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      if (error.status === 400) {
        this.message.showMessageBig(error.error.message);
        this._location.back();
      }
    })
  }


  showReserve() {
    this.setCheckingReq()
    this.isLoading = true;
    this.api.showReserve(this.ref_code).subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
        this.flight = this.data.reserves[0].flight;

        this.setRoomSelected();

      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      if (error.status === 400) {
        this.message.showMessageBig(error.error.message);
        this._location.back();
      }
    })
  }

  getCurrencyRate(code: string, room: any): number {

      let currencies = room.currencies;
      if (currencies) {
        switch (code) {
          case 'toman':
            return currencies.toman;
          case 'dollar':
            return currencies.dollar;
          case 'euro':
            return currencies.euro;
          case 'derham':
            return currencies.derham;
          default:
            return 0
        }
      } else {
        return 0;
      }
  }
  getRoomCount() {
    return this.rooms.length;
  }

  getPassengersCount() {
    let count = 0;
    this.rooms.forEach(x => {
      count += (x.passengers ?? []).length;
    })
    return count
  }
  getRoomPrice(room: any): number {
    let price = 0;
      this.getComputableRateList(room.rates).forEach((rate: any) => {
        price += rate.price * this.getCurrencyRate(rate.currency_code, room);
      })

    return price + this.getTransferPrice()
  }

  getTransferPrice() {
    let destID = this.data.reserves[0].flight.destination_id
    let transfers = this.data.reserves[1].room.services.filter((transfer:any) => transfer.airport_id === destID || transfer.airport_id === 0);

    let price = 0;
    transfers.forEach((x:any) => {
      price += (x?.rate ?? 0) * this.getCurrencyRate(x?.rate_type ?? '', this.data.reserves[1].room)
    })
    return price
  }



  getComputableDateList() {
    let dateList: any = this.calendarService.enumerateDaysBetweenDates(this.data.details.checkin, this.data.details.checkout, 'YYYY-MM-DD')
    dateList.pop();
    return dateList;
  }

  getComputableRateList(rates: RateDTO[]) {
    let result: RateDTO[] = []

    this.getComputableDateList().forEach((date: string) => {
      let itemFiltered = rates.filter((item: RateDTO) => item.date === date)
      if (itemFiltered.length > 0) {
        result.push(itemFiltered[0]);
      }
    })
    return result;
  }


  getExtraBedPrice(room: any): number {
    let price = 0;
      this.getComputableRateList(room.rates).forEach((rate: any) => {
        price += rate.extra_price * this.getCurrencyRate(rate.currency_code, room);
      })

    return price  + this.getTransferPrice()
  }

  getError(name: string) {
    return this.errorService.hasError(name)
  }

  setRoomSelected() {
    this.rooms = [];

      this.data.reserves.forEach((room:any,index:number) => {
        if(index > 0){
          let item = {
            request: this.data.details.request[index -1],
            room: room,
            passengers: [],
            total_price:this.getRoomPrice(room.room),
            totalExtraPrice:this.getExtraBedPrice(room.room)
          }
          this.rooms.push(item);
        }
      })


    this.reload()
  }




  reload() {
    this.showPassengers = false;
    setTimeout(() => this.showPassengers = true);
  }

  submit() {
    if (this.isPrivacyCheck) {
      this.setReq();
      this.api.create(this.req,this.ref_code).subscribe((res: any) => {
        if (res.isDone) {
          this.message.custom(res.message)
          this.router.navigateByUrl('/')
        } else {
          this.message.custom(res.message)
        }
      }, (error: any) => {
        if (error.status === 422) {
          window.scroll({
            top: 400,
            left: 0,
            behavior: 'smooth'
          });
          this.errorService.recordError(error.error.errors)
          this.checkError.check(error)
        }

      })
    } else {
      this.message.custom('لطفا قوانین و مقررات سایت را بپذیرید')
    }
  }

  setReq() {
    this.convertRooms()
    this.req = {
      reserves : this.finalRoomSelected,
      reserver_full_name: this.nameFC.value + ' ' + this.familyFC.value,
      reserver_phone: this.reserver_phoneFC.value ?? '',
      reserver_id_code: this.reserver_id_codeFC.value,

    }
  }

  onChange(name: string) {
    this.errorService.clear(name)
  }


  convertRooms() {
    this.finalRoomSelected= [];
    this.rooms.forEach(item => {
      let obj: ReservePassengerCreateDTO = {
        passengers: item.passengers ?? [],
        reserve_id: item.room.id
      }
      this.finalRoomSelected.push(obj)
    })

  }

  checkAuth() {
    if (this.session.isLoggedIn()) {
      this.submit()
    } else {
      this.auth()
    }
  }

  auth() {
    if (this.reserver_phoneFC.valid) {
      const dialog = this.dialog.open(ConfirmPhoneComponent, {
        width: '40%',
        data: this.publicService.fixNumbers(this.reserver_phoneFC.value)
      })
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.submit()
        }
      })
    } else {
      this.message.custom('لطفا تلفن همراه رزرو گیرنده را وارد کنید')
    }
  }
  openRulesPopup() {

  }
}
