import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { RateDTO, ReserveHotelDTO } from 'src/app/Core/Models/newPostDTO';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import {
  ReserveCheckingReqDTO,
  ReserveCreateDTO,
  ReserveInfoDTO,
  ReserveReqRoomDTO,
  ReserveRoomDTO
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

  isPrivacyCheck = false;

  req: ReserveCreateDTO = {
    hotel_id: 0,
    flight_id: 0,
    rooms: [],
    reserver_full_name: '',
    reserver_phone: '',
    reserver_id_code: '',
    checkin: '',
    checkout: '',
    stayCount: 0,
  }
  checkingReq!: ReserveCheckingReqDTO
  roomsSelected: ReserveRoomDTO[] = []
  data: ReserveInfoDTO = {
    checkin: '',
    checkout: '',
    flight: {} as transferRateListDTO,
    hotel: {} as ReserveHotelDTO,
    rooms: [],
    rooms_selected: [],
  };

  finalRoomSelected: ReserveReqRoomDTO[] = [];

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
    this.roomsSelected.forEach(item => {
      item.passengers?.forEach(pass => {
        this.totalPrice += (pass.price ?? 0);

      })
      if (item.id === result.id) {
        item.passengers = result.passengers;
        // item. = this.getRommTotalPrice(data.passengers, data.name)
      }
    })
  }



  checking() {
    this.setCheckingReq()
    this.isLoading = true;
    this.api.checking(this.checkingReq).subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
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

  getCurrencyRate(code: string, roomId: number): number {
    let roomFiltered = this.data.rooms.filter(x => x.id === roomId)
    if (roomFiltered.length > 0) {
      let currencies = roomFiltered[0].currencies;
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
    } else {
      return 0
    }
  }
  getRoomCount() {
    return this.roomsSelected.length;
  }

  getPassengersCount() {
    let count = 0;
    this.roomsSelected.forEach(x => {
      count += (x.passengers ?? []).length;
    })
    return count
  }
  getRoomPrice(roomId: number): number {
    let price = 0;
    let roomFiltered = this.data.rooms.filter(x => x.id === roomId)
    if (roomFiltered.length > 0) {
      this.getComputableRateList(roomFiltered[0].rates).forEach((rate: any) => {
        price += rate.price * this.getCurrencyRate(rate.currency_code, roomId);
      })
    }
    return price
  }


  getComputableDateList() {
    let dateList: any = this.calendarService.enumerateDaysBetweenDates(this.data.checkin, this.data.checkout, 'YYYY-MM-DD')
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


  getExtraBedPrice(roomId: number): number {
    let price = 0;
    let roomFiltered = this.data.rooms.filter(x => x.id === roomId)
    if (roomFiltered.length > 0) {
      this.getComputableRateList(roomFiltered[0].rates).forEach((rate: any) => {
        price += rate.extra_price * this.getCurrencyRate(rate.currency_code, roomId);
      })
    }
    return price
  }

  getError(name: string) {
    return this.errorService.hasError(name)
  }

  setRoomSelected() {
    this.data.rooms_selected.forEach((room, index) => {
      let x = this.data.rooms.filter(y => y.id === room.room_id)
      if (x.length > 0) {
        for (let i = 0; i < room.count; i++) {
          x[0].options = room;
          x[0].totalPrice = this.getRoomPrice(room.room_id)
          x[0].totalExtraPrice = this.getExtraBedPrice(room.room_id)
          this.roomsSelected.push(x[0]);
        }
      }
    })
  }




  reload() {
    this.showPassengers = false;
    setTimeout(() => this.showPassengers = true);
  }

  submit() {
    if (this.isPrivacyCheck) {
      this.setReq();
      this.api.create(this.req).subscribe((res: any) => {
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
      hotel_id: +this.hotelID,
      flight_id: +this.flightID,
      rooms: this.finalRoomSelected,
      reserver_full_name: this.nameFC.value + ' ' + this.familyFC.value,
      reserver_phone: this.reserver_phoneFC.value ?? '',
      reserver_id_code: this.reserver_id_codeFC.value,
      checkin: this.data.checkin,
      checkout: this.data.checkout,
      stayCount: this.checkingReq.stayCount,
    }
  }

  onChange(name: string) {
    this.errorService.clear(name)
  }


  convertRooms() {
    this.finalRoomSelected = [];
    this.roomsSelected.forEach(item => {
      let obj: ReserveReqRoomDTO = {
        passengers: item.passengers ?? [],
        room_id: item.id
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
