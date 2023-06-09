import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelRatesSetReqDTO } from 'src/app/Core/Models/hotelDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import * as moment from 'jalali-moment';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { roomDTO } from 'src/app/Core/Models/newPostDTO';
export interface ConfirmPriceReqDTO {
  checkin: any;
  checkout: any;
  hotelID: number;
  roomID: number;
  room: roomDTO;
  type: number;
  bedCount: number;
  chd_price: number;
  currency_code: string;
}
@Component({
  selector: 'prs-confirm-pricing-modal',
  templateUrl: './confirm-pricing-modal.component.html',
  styleUrls: ['./confirm-pricing-modal.component.scss']
})
export class ConfirmPricingModalComponent implements OnInit {
  priceFC = new FormControl()
  offerPriceFC = new FormControl()
  rateFC = new FormControl('all')
  capacityFC = new FormControl()
  bedCountFC = new FormControl();
  chd_priceFC = new FormControl();
  bedPriceFC = new FormControl();
  offerBedPriceFC = new FormControl();
  checkin_base = false
  not_checkin_base = false;
  req!: any;
  constructor(public dialogRef: MatDialogRef<ConfirmPricingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPriceReqDTO,
    public api: PostApiService,
    public message: MessageService,
    public errorService: ErrorsService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  submit() {
    this.addHotelRates()
  }

  addHotelRates() {
    this.req = {
      date_from: moment(this.data.checkin.dateEn).format('YYYY-MM-DD'),
      date_to: moment(this.data.checkout.dateEn).format('YYYY-MM-DD'),
      type: this.data.type,
      checkin_base: this.not_checkin_base ? false : this.offerPriceFC.value ? true : null,
      available_room_count: this.capacityFC.value,
      extra_bed_count: this.bedCountFC.value ? +this.bedCountFC.value : null,
      price: this.priceFC.value !== null ? +this.priceFC.value : null,
      chd_price: this.chd_priceFC.value ? +this.chd_priceFC.value : null,
      extra_price: this.bedPriceFC.value !== null ? +this.bedPriceFC.value : null,
      currency_code: this.rateFC.value !== 'all' ? this.rateFC.value : null,
      offer_price: this.checkin_base ? this.offerPriceFC.value : null,
    }
    this.req = {
      ...Object.fromEntries(
        Object.entries(this.req).filter(
          ([key, value]) => (value != null)
        )
      )
    }

    this.api.rating(+this.data.roomID, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.dialogRef.close(true)
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.errorService.check(error)
    })
  }

  getCurrencyLabel() {
    switch (this.data.currency_code) {
      case 'toman': return 'تومان';
      case 'euro': return 'یورو';
      case 'derham': return 'درهم';
      case 'dollar': return 'دلار';
      default: return ''
    }
  }
}
