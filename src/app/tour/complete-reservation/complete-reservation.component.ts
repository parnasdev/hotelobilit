import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
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
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ITourShowReserve } from '../core/models/tour.model';

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
  flightID = '0';
  returnFlightID = '0'
  hotelID = '0';
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


  checkingReq!: ReserveCheckingReqDTO
  data!: ITourShowReserve

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
    this.returnFlightID = this.route.snapshot.paramMap.get('returnFlight') ?? ''


    this.checking();
  }


  setCheckingReq() {
    this.route.queryParams.subscribe(params => {
      this.checkingReq = {
        checkin: params['checkin'],
        checkout: params['checkout'],
        stayCount: params['stayCount'],
        hotel_id: +this.hotelID,
        flight_id: +this.flightID,
        return_flight_id: +this.returnFlightID,
        rooms: JSON.parse(params['rooms'])
      }
    }
    );
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
        this.minutes = +this.data.information.expired_in_minutes;
        // this.startTimer();
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

  getError(name: string) {
    return this.errorService.hasError(name)
  }


  reload() {
    this.showPassengers = false;
    setTimeout(() => this.showPassengers = true);
  }

  submit() {
    if (this.isPrivacyCheck) {
      this.setReq();
      this.api.create(this.req, this.ref_code).subscribe((res: any) => {
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
    this.req = {
      reserves: this.getRooms(),
      reserver_full_name: this.nameFC.value + ' ' + this.familyFC.value,
      reserver_phone: this.reserver_phoneFC.value ?? '',
      reserver_id_code: this.reserver_id_codeFC.value,

    }
  }

  getRooms() {
    let list:any[] = [];
    this.data.selected_rooms.forEach(x => {
      let obj = {
        reserve_id: x.reserve_id,
        passengers: x.passengers
      }
      list.push(obj)
    })
    return list;
  }

  onChange(name: string) {
    this.errorService.clear(name)
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


  getRoomPassengers(event: any) {

  }
}
