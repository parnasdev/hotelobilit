
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelRatesSetReqDTO } from 'src/app/Core/Models/hotelDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import * as moment from 'jalali-moment';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { roomDTO } from 'src/app/Core/Models/newPostDTO';
import {PublicService} from "../../../Core/Services/public.service";
export interface ConfirmPriceReqDTO {
  checkin: any;
  checkout: any;
  hotelID: number;
  roomID: number;
  room: roomDTO;
  type: number;
  bedCount: number;
  currency_code: string;
  isJustRoomCount: boolean
}
@Component({
  selector: 'prs-confirm-pricing-modal-en',
  templateUrl: './confirm-pricing-modal-en.component.html',
  styleUrls: ['./confirm-pricing-modal-en.component.scss']
})
export class ConfirmPricingModalEnComponent implements OnInit {
  priceFC = new FormControl()
  offerPriceFC = new FormControl()
  rateFC = new FormControl('all')
  capacityFC = new FormControl()
  bedCountFC = new FormControl();
  bedPriceFC = new FormControl();
  checkin_base = false;
  not_checkin_base = false;
  chd_w_priceFC = new FormControl()
  offerBedPriceFC = new FormControl();
  req!: any;
  submitLoading = false;
  constructor(public dialogRef: MatDialogRef<ConfirmPricingModalEnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPriceReqDTO,
    public api: PostApiService,
              public publicService: PublicService,
              public message: MessageService,
    public errorService: ErrorsService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {

    //
    // this.data.currency_code
    // this.bedCountFC.setValue(this.data.bedCount)
  }

  submit() {

    if (this.data.currency_code && this.data.currency_code !== '') {
      this.addHotelRates()
    } else {
      this.message.custom( 'The exchange rate has not been entered')
    }  }

  addHotelRates() {
    this.req = {
      date_from: moment(this.data.checkin.dateEn).format('YYYY-MM-DD'),
      date_to: moment(this.data.checkout.dateEn).format('YYYY-MM-DD'),
      available_room_count:(this.capacityFC.value || this.capacityFC.value === 0) ? this.publicService.fixNumbers(+this.capacityFC.value) : null,
      extra_bed_count: this.publicService.fixNumbers(this.bedCountFC.value) ? +this.bedCountFC.value : null,
      price: this.priceFC.value !== null ? +this.priceFC.value : null,
      type: this.data.type,
      chd_w_price: this.chd_w_priceFC.value ? +this.chd_w_priceFC.value : null,
      extra_price: this.bedPriceFC.value !== null ? +this.bedPriceFC.value : null,
      currency_code: this.rateFC.value !== 'all' ? this.rateFC.value : null,
      checkin_base: this.not_checkin_base ? false : this.checkin_base ? true : null,
      offer_price: this.checkin_base ? this.offerPriceFC.value : null,

      // offer_extra_price: this.offerBedPriceFC.value,
      // offer_price: this.offerPriceFC.value,
    }
    this.req = {
      ...Object.fromEntries(
        Object.entries(this.req).filter(
          ([key, value]) => (value != null)
        )
      )
    }
    this.submitLoading = true;

    this.api.rating(+this.data.roomID, this.req).subscribe((res: any) => {
      this.submitLoading = false;

      if (res.isDone) {
        this.message.custom(res.message)
        this.dialogRef.close(true)
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.submitLoading = false;
      this.errorService.check(error)    })
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
