import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { RoomTypeListDTO, RoomTypePriceDTO, RoomTypeReqDTO } from "../../Core/Models/roomTypeDTO";
import { RoomTypeApiService } from "../../Core/Https/room-type-api.service";
import { MessageService } from "../../Core/Services/message.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RoomTypeDTO } from 'src/app/Core/Models/hotelDTO';
import { hotelRates } from 'src/app/Core/Models/tourDTO';

interface RoomPopUpInputDTO {
  'prices': string;
  'hotel_rooms': RoomTypeDTO[],
  'rates': hotelRates[]
  'hotel_id' :number
}

@Component({
  selector: 'prs-set-price-popup',
  templateUrl: './set-price-popup.component.html',
  styleUrls: ['./set-price-popup.component.scss']
})
export class SetPricePopupComponent implements OnInit {
  nameFC = new FormControl('');
  labelFC = new FormControl('');
  req!: RoomTypeReqDTO;
  roomTypes: RoomTypeListDTO[] = [];

  tourDetail: any;

  rooms: any[] = []

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<SetPricePopupComponent>,
    public message: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: RoomPopUpInputDTO,
    public roomTypeApi: RoomTypeApiService) {
  }

  form = this.fb.group({
    rooms: this.fb.array([], Validators.required)
  });

  ngOnInit(): void {
    this.rooms = this.data.hotel_rooms;
    // if (this.data && this.data.length > 0) {
    //   this.setFormArray();
    // }
  }

  getPrice(roomName: string) {
    // return this.setService.getRoomCalculatedPrice(roomName, this.setService.getHotelIndex(this.data.hotel_id));
  }

  getCapacity(roomName: string) {
    let result = 0
    this.data.rates.forEach((item: hotelRates) => {
      if (item.roomType.name === roomName) {
        result = item.capacity
      }
    })
    return result;
  }

}
