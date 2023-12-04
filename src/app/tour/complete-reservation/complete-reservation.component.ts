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
import * as moment from 'jalali-moment';

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

  showPassengers = true;
  isLoading = false;
  ref_code: string = ''
  expired_time: string = ''
  isPrivacyCheck = false;
  stay_count = 0
  req: ReserveCreateDTO = {
    reserves: [],
    reserver_full_name: '',
    reserver_phone: '',
    reserver_id_code: ''
  }


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
    this.ref_code = this.route.snapshot.paramMap.get('ref_code') ?? ''
    this.showReserve();
  }


  showReserve() {
    this.isLoading = true;
    this.api.showReserve(this.ref_code).subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
        let d: string = this.data.information.expired_in_minutes;
        this.minutes = this.getTime(d).minute
        this.seconds = this.getTime(d).second
        this.getStayCount()
        this.startTimer();
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


  getStayCount() {
    this.stay_count = this.calendarService.enumerateDaysBetweenDates(this.data.hotel.checkin, this.data.hotel.checkout).length - 1
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
          this.confirm()
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
        } else if (error.status === 400) {
          this.message.custom(error.error.message);
          this.router.navigateByUrl('/')
        }

      })
    } else {
      this.message.custom('لطفا قوانین و مقررات سایت را بپذیرید')
    }
  }

  confirm() {
    this.setReq();
    this.api.confirm(this.ref_code).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.errorService.check(error);
    })

  }
  ngOnDestroy() {

  }

  getTime(expired_at: string) {
    let duration = moment.duration(moment(expired_at).diff(new Date()));
    return { minute: duration.get('minutes'), second: duration.get('seconds') };
  }

  startTimer() {
    let id = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.seconds = 59;
        this.minutes--;
      } else {
        this.message.custom('زمان شما به اتمام رسید');
        this.router.navigateByUrl('/')
        clearInterval(id);

      }
    }, 1000);
  }

  formatter(n: number): string {
    return n > 9 ? ('' + n) : ('0' + n);
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
    let list: any[] = [];
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


  getRoomPassengers() {
    let count: number = 0
    this.data.selected_rooms.forEach(x => {
      count += x.passengers.length
    })
  }
  getRoomsCount() {
    let count: number = 0
    this.data.selected_rooms.forEach(x => {
      count += 1
    })
  }
}
