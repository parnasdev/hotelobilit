import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { IPassenger, ISelectedRoom } from '../core/models/tour.model';

@Component({
  selector: 'prs-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, OnChanges {
  @Input() age = 0;
  @Input() index = 0
  @Input() RoomData!: ISelectedRoom
  @Output() passengerResult = new EventEmitter();
  @Input() tourType: boolean = false;
  isDesktop = false;
  isTablet = false;
  isMobile = false;
  @Input() data: any;// false = 'تور خارجی'  // true = ' تور داخلی'
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
      for (let i = 0; i < (this.RoomData.passengers.length ?? []); i++) {
        this.addRow(this.RoomData.passengers[i]);
      }

    }
    debugger
    if (changes['age'].firstChange) {
      if(this.age === 0) {
        this.childMinDate = this.calenderService.changeDate(new Date(), -(12), 'year','jYYYY-jMM-jDD');
      } else {
        this.childMinDate = this.calenderService.changeDate(new Date(), -(this.age), 'year','jYYYY-jMM-jDD');
      }
      this.minDate = '1300-01-01'
      this.infantMinDate = this.calenderService.changeDate(new Date(), -(2), 'year','jYYYY-jMM-jDD');
      this.maxDate = jmoment(new Date()).format('jYYYY-jM-jD')
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

  addRow(passenger:IPassenger | null = null) {
    const Passengers = this.fb.group({
      name: [passenger?.name, [Validators.required]],
      family: [passenger?.family, [Validators.required]],
      gender: [passenger?.gender, [Validators.required]],
      bed_type: 'normal',
      nationality: [passenger?.nationality, [Validators.required]],
      id_code: this.tourType ? [passenger?.id_code, [Validators.required]] : [''],
      passport: !this.tourType ? [passenger?.passport, [Validators.required]] : [''],
      expired_passport: !this.tourType ? [passenger?.expired_passport, [Validators.required]] : [''],
      birth_day: [passenger?.birth_day, [Validators.required]],
      type: passenger?.type,
      price: passenger?.total_room_price
    })
    this.PassengerForm.push(Passengers);
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
    let currencies = this.data.reserves[2].room.currencies;
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
    let destID = this.data.reserves[0].flight.destination_id
    let transfer = this.data.reserves[2].room.services.find((transfer:any) => transfer.airport_id === destID && transfer.airport_id === 0);
    return (transfer?.rate ?? 0) * this.getCurrencyRate(transfer?.rate_type ?? '', 0)
  }

  convertPassengerObject() {
    let passengers: IPassenger[] = [];
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
    return this.errorService.hasError('reserves.' + this.index + '.passengers')
  }

  hasError(i: number, name: string) {
    return this.errorService.hasError('reserves.' + this.index + '.passengers.' + i + '.' + name)
  }

  getError(i: number, name: string) {
    return this.errorService.getError('reserves.' + this.index + '.passengers.' + i + '.' + name)
  }
}
