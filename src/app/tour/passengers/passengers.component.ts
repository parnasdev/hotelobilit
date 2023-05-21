import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservePassengersDTO, ReserveRoomDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, OnChanges {
  @Input() age = '0';
  @Input() markAsRead = false;
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
    public calenderService: CalenderServices,
    public message: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['RoomData'].firstChange) {
      for (let i = 0; i < (this.RoomData?.Adl_capacity ?? []); i++) {
        this.addRow();
      }
    }

    if(changes['markAsRead']) {
      if(this.markAsRead) {
        this.markFormGroupTouched(this.ReserveForm)
      }
    }
    // if (changes.age.firstChange) {
    //   this.minDate = new Date(this.calenderService.changeMiladiDate(new Date(), -(+this.age), 'year'));
    //   this.infantMinDate = new Date(this.calenderService.changeMiladiDate(new Date(), -(2), 'year'));

    //   this.show = true
    // }

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
    (<any>Object).values(formGroup.controls).forEach((control:any) => {
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

  addRow() {
    const Passengers = this.fb.group({
      name: ['', [Validators.required]],
      family: ['', [Validators.required]],
      id_code:  this.tourType ?  ['', [Validators.required]] : [''],
      passport:  !this.tourType ?  ['', [Validators.required]] : [''],
      expired_passport: !this.tourType ?  ['', [Validators.required]] : [''],
      birth_day: ['', [Validators.required]],
      type: 'adl',
    })
    this.PassengerForm.push(Passengers);
  }

  convertPassengerObject() {
    let passengers: ReservePassengersDTO[] = [];
    this.PassengerForm.controls.forEach((item, index) => {
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

    switch (label.value) {
      case 'cwb':
        return 'کودک با تخت'
      case 'cnb':
        return 'کودک بدون تخت'
      case 'supervisor':
        return 'سرپرست'
      case 'passenger':
        return 'همراه'
      case 'infant':
        return 'نوزاد'
      default:
        return ''
    }
  }


}
