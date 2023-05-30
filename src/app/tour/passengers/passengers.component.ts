import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReservePassengersDTO, ReserveRoomDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, OnChanges {
  @Input() age = '0';
  @Input() index =0
  @Input() RoomData!: ReserveRoomDTO;
  @Output() passengerResult = new EventEmitter();
  @Input() tourType: boolean = false;   // false = 'تور خارجی'  // true = ' تور داخلی'
  @Input() inCommingPassengers: any = {
    capacity: 0,
    id: 0,
    name: '',
    passengers: [],
    price: 0,
    supply: 0
  }
  minDate = new Date();
  infantMinDate = new Date();
  maxDate = new Date();
  show = false;
  constructor(public fb: FormBuilder,
    public errorService: ErrorsService,
    public calenderService: CalenderServices,
    public message: MessageService) { }

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
    }

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
    if (this.getPassebgerLabel(item.get('type')) === 'سرپرست' || this.getPassebgerLabel(item.get('type')) === 'همراه') {
      return null
    } else if (this.getPassebgerLabel(item.get('type')) === 'نوزاد') {
      return this.infantMinDate
    } else {
      return this.minDate
    }
  }

  get PassengerForm() {
    return this.ReserveForm.get('passengers') as FormArray;
  }

  addRow(type = 'adl') {
    const Passengers = this.fb.group({
      name: ['', [Validators.required]],
      family: ['', [Validators.required]],
      gender: ['0', [Validators.required]],
      nationality: ['0', [Validators.required]],
      id_code: this.tourType ? ['', [Validators.required]] : [''],
      passport: !this.tourType ? ['', [Validators.required]] : [''],
      expired_passport: !this.tourType ? ['', [Validators.required]] : [''],
      birth_day: ['', [Validators.required]],
      type: type,
    })
    this.PassengerForm.push(Passengers);
  }

  convertPassengerObject() {
    let passengers: ReservePassengersDTO[] = [];
    this.PassengerForm.controls.forEach((item, index) => {
    item.value.birth_day = moment(item.value.birth_day).format('YYYY-MM-DD');
      passengers.push(item.value)
      console.log(item.value.birth_day);
      
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


  onChange(): void {
    // if (this.PassengerForm.valid) {
    this.convertPassengerObject()

    // }else {
    //   this.markFormGroupTouched()
    // this.PassengerForm.controls.forEach(x => {
    //   x.controls.forEach((control:FormControl) => {
    //   })
    //   this.markFormGroupTouched(control)
    // })
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

  getPassebgerLabel(label: any) {

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
          return 'بزرگسال'
      default:
        return ''
    }
  }
  getRoomError() {
    return this.errorService.hasError('rooms.' + this.index + '.passengers')
  }

  hasError(i: number, name: string){
    return this.errorService.hasError('rooms.' + this.index + '.passengers.' + i + '.' + name)
  }
  getError(i: number, name: string){
    return this.errorService.getError('rooms.' + this.index + '.passengers.' + i + '.' + name)
  }
}
