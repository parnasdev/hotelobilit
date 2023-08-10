import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';

import { ReserveHotelDTO } from 'src/app/Core/Models/newPostDTO';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { ReserveInfoDTO, ReservePassengersDTO, ReserveRoomDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ResponsiveService } from "../../Core/Services/responsive.service";

@Component({
  selector: 'prs-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, OnChanges {
  @Input() age = 0;
  @Input() index = 0
  @Input() RoomData!: ReserveRoomDTO;
  @Output() passengerResult = new EventEmitter();
  @Input() tourType: boolean = false;
  isDesktop = false;
  isTablet = false;
  isMobile = false;
  @Input() data: ReserveInfoDTO = {
    checkin: '',
    checkout: '',
    flight: {} as transferRateListDTO,
    hotel: {} as ReserveHotelDTO,
    rooms: [],
    rooms_selected: [],

  };// false = 'تور خارجی'  // true = ' تور داخلی'
  @Input() inCommingPassengers: any = {
    capacity: 0,
    id: 0,
    name: '',
    passengers: [],
    price: 0,
    supply: 0
  }

  show = false;

  childMinDate = ''
  minDate = ''
  infantMinDate = ''
  maxDate = ''
  passportMinDate = ''
  minDateTodayShamsi = '';
  minDateTodayMiladi = ''

  constructor(public fb: FormBuilder,
    public errorService: ErrorsService,
    public mobileService: ResponsiveService,
    public calenderService: CalenderServices,
    public message: MessageService) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()
    this.isTablet = mobileService.isTablet()

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['RoomData'].firstChange) {
      for (let i = 0; i < (this.RoomData?.Adl_capacity ?? []); i++) {
        this.addRow();
      }
      for (let index = 0; index < (this.RoomData.options?.chd_count ?? 0); index++) {
        this.addRow('chd');
      }
      for (let index = 0; index < (this.RoomData.options?.inf_count ?? 0); index++) {
        this.addRow('inf');
      }
      for (let index = 0; index < (this.RoomData.options?.extra_count ?? 0); index++) {
        this.addRow('adl', 'extra');
      }
    }
    if (changes['age'].firstChange) {
      this.childMinDate = this.calenderService.changeDate(new Date(), -(this.age), 'year');
      this.minDate = '1300-01-01'
      this.infantMinDate = this.calenderService.changeDate(new Date(), -(2), 'year');
      this.maxDate = moment(new Date()).format('jYYYY-jM-jD')
      this.passportMinDate = this.calenderService.changeMiladiDate(new Date(), 6, 'month')
      this.show = true
      this.minDateTodayShamsi = jmoment(new Date()).format('jYYYY-jM-jD');
      this.minDateTodayMiladi = jmoment(new Date()).format('YYYY-MM-DD');
    }

    this.convertPassengerObject()
  }
  getErrorItem(i: number, name: string) {
    return { 'name': name, 'index': this.index, 'i': i }
  }


  getDate(i: number, name: string) {
    return this.PassengerForm.controls[i].get(name)?.value
  }


  removeItem(index: number) {
    this.PassengerForm.removeAt(index);
    this.convertPassengerObject()
  }

  ReserveForm: FormGroup = this.fb.group({
    show: '',
    passengers: this.fb.array([], Validators.required),
  })

  ngOnInit(): void {
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  getMinDate(item: any) {
    let type = item.get('type').value ?? ''
    if (type === 'adl') {
      return this.minDate
    } else if (type === 'inf') {
      return this.infantMinDate
    } else {
      return this.childMinDate
    }
  }

  get PassengerForm() {
    return this.ReserveForm.get('passengers') as FormArray;
  }

  addRow(type = 'adl', bed_type = 'normal') {
    const Passengers = this.fb.group({
      name: ['', [Validators.required]],
      family: ['', [Validators.required]],
      gender: ['0', [Validators.required]],
      bed_type: bed_type,
      nationality: ['0', [Validators.required]],
      id_code: this.tourType ? ['', [Validators.required]] : [''],
      passport: !this.tourType ? ['', [Validators.required]] : [''],
      expired_passport: !this.tourType ? ['', [Validators.required]] : [''],
      birth_day: ['', [Validators.required]],
      type: type,
      price: this.getPrice(type, bed_type)
    })
    this.PassengerForm.push(Passengers);
  }


  getPrice(type: string, bed_type = 'normal') {
    switch (type) {
      case 'adl':
        if (bed_type === 'normal') {
          return (this.RoomData.totalPrice ?? 0) + this.data.flight.adl_price + this.getTransferPrice();
        } else {
          return (this.RoomData.totalExtraPrice ?? 0) + this.data.flight.adl_price + this.getTransferPrice();
        }
      case 'chd':

        return ((this.RoomData.totalPrice ?? 0) / 2) + this.data.flight.chd_price
      case 'inf':
        return this.data.flight.inf_price
      default:
        return 0
    }
  }

  getbirthDate(i: number, date: string) {
    this.PassengerForm.controls[i].get('birth_day')?.setValue(date);
    this.onChange(i, 'birth_day')
  }

  getExpired_passport(i: number, date: string) {
    this.PassengerForm.controls[i].get('expired_passport')?.setValue(date);
    this.onChange(i, 'expired_passport')
  }

  getCurrencyRate(code: string, roomIndex: number): number {
    let currencies = this.data.rooms[roomIndex].currencies;
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
  }



  getTransferPrice() {
    let destID = this.data.flight.destination_id
    let transfer = this.data.rooms[0].services.find(transfer => transfer.airport_id === destID);
    return (transfer?.rate ?? 0) * this.getCurrencyRate(transfer?.rate_type ?? '', 0)
  }

  convertPassengerObject() {
    let passengers: ReservePassengersDTO[] = [];
    this.PassengerForm.controls.forEach((item, index) => {
      item.value.birth_day = moment(item.value.birth_day).format('YYYY-MM-DD');
      passengers.push(item.value)
    });
    this.RoomData.passengers = passengers;
    this.passengerResult.emit(this.RoomData);
  }


  checkAllowAddPassengerWithType(type: string): boolean {
    if (type === '') {
      return true;
    } else {
      let result = true;
      this.PassengerForm.controls.forEach((item, index) => {
        if (item.value.type === type && (type !== 'passenger' && type !== 'supervisor')) {
          result = false;
        }
      });
      return result
    }
  }




  getRoomNameFa(roomName: string | undefined) {
    switch (roomName) {
      case 'twin':
        return 'دو تخته'
      case 'single':
        return 'یک تخته'
      case 'triple':
        return 'سه تخته'
      case 'quad':
        return 'چهارتخته'
      case 'cwb':
        return 'cwb'
      default:
        return ''
    }
  }

  getPassebgerLabel(label: any, bed_type: string = 'normal') {

    switch (label) {
      case 'chd':
        return 'کودک با تخت'
      case 'cnb':
        return 'کودک بدون تخت'
      case 'supaervisor':
        return 'سرپرست'
      case 'passenger':
        return 'همراه'
      case 'inf':
        return 'نوزاد'
      case 'adl':
        if (bed_type === 'normal') {
          return 'بزرگسال'
        } else {
          return 'تخت اضافه'
        }

      default:
        return ''
    }
  }
  onChange(i: number, name: string): void {
    let str: any = 'rooms.' + this.index + '.passengers.' + i + '.' + name;
    this.errorService.clear(str)
    this.convertPassengerObject()

  }

  getRoomError() {
    return this.errorService.hasError('rooms.' + this.index + '.passengers')
  }

  hasError(i: number, name: string) {
    return this.errorService.hasError('rooms.' + this.index + '.passengers.' + i + '.' + name)
  }

  getError(i: number, name: string) {
    return this.errorService.getError('rooms.' + this.index + '.passengers.' + i + '.' + name)
  }
}
