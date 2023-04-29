import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelApiService } from 'src/app/Core/Https/hotel-api.service';
import { HotelRatesSetReqDTO } from 'src/app/Core/Models/hotelDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import * as moment from 'jalali-moment';
export interface ConfirmPriceReqDTO {
  checkin: any;
  checkout: any;
  hotelID: number;
  roomID: number;
}
@Component({
  selector: 'prs-confirm-pricing-modal',
  templateUrl: './confirm-pricing-modal.component.html',
  styleUrls: ['./confirm-pricing-modal.component.scss']
})
export class ConfirmPricingModalComponent implements OnInit {
  priceFC = new FormControl()
  offerPriceFC = new FormControl()
  rateFC = new FormControl('toman')
  capacityFC = new FormControl()
  bedCountFC = new FormControl();
  bedPriceFC = new FormControl();
  offerBedPriceFC = new FormControl();
  req!: HotelRatesSetReqDTO;
  constructor(public dialogRef: MatDialogRef<ConfirmPricingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPriceReqDTO,
    public api: HotelApiService,
    public message: MessageService,
    public errorService: ErrorsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  submit() {
    this.addHotelRates()
  }

  addHotelRates() {
    this.req = {
      date_from: moment(this.data.checkin.dateEn).format('YYYY-MM-DD'),
      date_to: moment(this.data.checkout.dateEn).format('YYYY-MM-DD'),
      available_room_count: this.capacityFC.value,
      extra_bed_count: +this.bedCountFC.value,
      price: +this.priceFC.value,
      offer_price: +this.offerPriceFC.value,
      extra_price: +this.bedPriceFC.value,
      offer_extra_price: +this.offerBedPriceFC.value,
      currency_code: this.rateFC.value
    }
    // this.api.addHotelRates(+this.data.hotelID, this.data.roomID, ).subscribe((res: any) => {
    //   if (res.isDone) {
    //     this.message.custom(res.message)
    //     this.dialogRef.close(true)
    //   } else {
    //     this.message.custom(res.message)
    //   }
    // }, (error: any) => {
    //   this.errorService.check(error)
    // })
  }
}
