import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { ReserveHotelDTO } from 'src/app/Core/Models/newPostDTO';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { ReserveCheckingReqDTO, ReserveCreateDTO, ReserveInfoDTO, ReserveReqRoomDTO, ReserveRoomDTO } from 'src/app/Core/Models/reserveDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import {Location} from '@angular/common';

@Component({
  selector: 'prs-complete-reservation',
  templateUrl: './complete-reservation.component.html',
  styleUrls: ['./complete-reservation.component.scss']
})
export class CompleteReservationComponent implements OnInit {
  flightID = '';
  hotelID = '';
  showPassengers = true;
  req: ReserveCreateDTO = {
    hotel_id: 0,
    flight_id: 0,
    rooms: [],
    reserver_full_name: '',
    reserver_phone: '',
    reserver_id_code: '',
    checkin: '',
    stayCount: 0,
  }
  checkingReq!: ReserveCheckingReqDTO
  roomsSelected: ReserveRoomDTO[] = []
  data: ReserveInfoDTO = {
    flight: {} as transferRateListDTO,
    hotel: {} as ReserveHotelDTO,
    rooms: [],
    rooms_selected: [],
  };

  finalRoomSelected: ReserveReqRoomDTO[] = [];

  fullNameFC = new FormControl();
  reserver_phoneFC = new FormControl();
  reserver_id_codeFC = new FormControl();
  formGroup: FormGroup = this.fb.group({
    reserver_id_code: this.reserver_id_codeFC,
    reserver_phone: this.reserver_phoneFC,
    fullName: this.fullNameFC,
  })
  constructor(public api: ReserveApiService,
    public message: MessageService,
    private _location: Location,
    public fb: FormBuilder,
    public errorService: ErrorsService,
    public router: Router,
    public checkError: CheckErrorService,
    public route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.hotelID = this.route.snapshot.paramMap.get('hotel') ?? ''
    this.flightID = this.route.snapshot.paramMap.get('flight') ?? ''

    this.checking();
  }


  setCheckingReq() {
    this.route.queryParams.subscribe(params => {
      this.checkingReq = {
        checkin: params['checkin'],
        stayCount: params['stayCount'],
        hotel_id: +this.hotelID,
        flight_id: +this.flightID,
        rooms: JSON.parse(params['rooms'])
      }
    }
    );
  }


  getRoomData(result: any) {

    this.roomsSelected.forEach(item => {

      if (item.id === result.id) {
        item.passengers = result.passengers;
        // item. = this.getRommTotalPrice(data.passengers, data.name)
      }
    })
    // this.getTotalPrice();
  }

  checking() {
    this.setCheckingReq()
    this.api.checking(this.checkingReq).subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
        this.setRoomSelected();
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      if(error.status === 400) {
        this.message.showMessageBig(error.error.message);
        this._location.back();
      }
    })
  }

  getError(name: string){
    return this.errorService.hasError(name)
  }

  setRoomSelected() {
    this.data.rooms_selected.forEach(room => {
      let x = this.data.rooms.filter(y => y.id === room.room_id)
      if (x.length > 0) {
        for (let i = 0; i < room.count; i++) {
          x[0].options = room;
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
    this.setReq();
    this.api.create(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.errorService.recordError(error.error.errors)
      this.checkError.check(error)
    })
  }

  setReq() {
    this.convertRooms()
    this.req = {
      hotel_id: +this.hotelID,
      flight_id: +this.flightID,
      rooms: this.finalRoomSelected,
      reserver_full_name: this.fullNameFC.value,
      reserver_phone: this.reserver_phoneFC.value,
      reserver_id_code: this.reserver_id_codeFC.value,
      checkin: this.checkingReq.checkin,
      stayCount: this.checkingReq.stayCount,
    }
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


  openRulesPopup() {

  }
}
