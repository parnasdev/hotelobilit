import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { ReserveCheckingReqDTO, ReserveInfoDTO } from 'src/app/Core/Models/reserveDTO';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-complete-reservation',
  templateUrl: './complete-reservation.component.html',
  styleUrls: ['./complete-reservation.component.scss']
})
export class CompleteReservationComponent implements OnInit {
  flightID = '';
  hotelID = '';
  checkingReq!: ReserveCheckingReqDTO

  data!: ReserveInfoDTO;
  constructor(public api: ReserveApiService,
    public message: MessageService,
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

  }

  checking() {
    this.setCheckingReq()
    this.api.checking(this.checkingReq).subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }


  submit() {

  }

  getCity(city: any) {

  }

  openRulesPopup() {

  }
}
