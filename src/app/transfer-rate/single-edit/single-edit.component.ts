import { Component, OnInit } from '@angular/core';
import { AddComponent } from '../add/add.component';
import { debounce } from 'rxjs';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'prs-single-edit',
  templateUrl: './single-edit.component.html',
  styleUrls: ['./single-edit.component.scss']
})
export class SingleEditComponent extends AddComponent implements OnInit {
  id = ''
  infoData!: transferRateListDTO
  editData: any;
  showData = false;

  adl_priceFC = new FormControl()
  origin_dateFC = new FormControl()
  destination_dateFC = new FormControl()
  chd_priceFC = new FormControl()
  inf_priceFC = new FormControl()
  capacityFC = new FormControl()
  override ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? ''

    this.getInfoData();
  }


  getInfoData(): void {
    this.isLoading = true
    this.flightApi.getFlightEditPage(+this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.editData = res.data
        this.infoData = this.editData.flight;
        this.setValue()
        this.show = true;
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false
      this.message.error()
      this.checkError.check(error);
    })
  }

  setValue() {
    this.selectedCityFC.setValue(this.infoData.cities)
    this.form.controls.origin_id.setValue(this.infoData.origin_id.toString());
    this.form.controls.destination_id.setValue(this.infoData.destination_id.toString());
    this.form.controls.origin_airline_id.setValue(this.infoData.airline_id.toString());
    this.form.controls.destination_airline_id.setValue(this.infoData.flight.airline_id.toString());
    this.form.controls.origin_time.setValue(this.infoData.time);
    this.form.controls.destination_time.setValue(this.infoData.flight.time);
    this.form.controls.origin_flight_number.setValue(this.infoData.flight_number.toString());
    this.form.controls.destination_flight_number.setValue(this.infoData.flight.flight_number.toString());
    this.checkin_tomorrow = this.infoData.checkin_tomorrow ? 1 : 0
    this.checkout_yesterday = this.infoData.checkout_yesterday ? 1 : 0

    this.adl_priceFC.setValue(this.infoData.adl_price)
    this.originDateFC.setValue(this.infoData.date)
    this.destination_dateFC.setValue(this.infoData.flight.date)
    this.chd_priceFC.setValue(this.infoData.chd_price)
    this.inf_priceFC.setValue(this.infoData.inf_price)
    this.capacityFC.setValue(this.infoData.capacity)

    this.showData = true
  }
  getCity(id: number) {
    return this.editData.cities.find((y: any) => y.id === id).name
  }




  updateTransferRate() {
    this.isLoading = true
    this.flightApi.UpdateDataFlight(this.TransferRateRequest, +this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.isLoading = false;
        this.message.showMessageBig(res.message);
        this.errorService.clear();
        this.router.navigateByUrl('/panel/transferRate');
      }
    }, (error: any) => {
      this.isLoading = false;
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
        this.markFormGroupTouched(this.form);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })
  }

  updateRequest(type: string) {
    this.type = type;
    this.setUpdateReq();
    this.updateTransferRate();
  }


  removeTransferRate(id: number, index: number) {
    this.isLoading = true
    this.flightApi.removeDataFlight(id).subscribe((res: any) => {
      if (res.isDone) {
        this.isLoading = false;
        this.message.showMessageBig(res.message);
        this.RatesForm.removeAt(index);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.checkError.check(error);
    })
  }

  removeRates(i: any) {
    const id = this.RatesForm.controls[i].value.id
    if (id && id !== 0) {
      this.removeTransferRate(id, i)
    } else {
      this.RatesForm.removeAt(i);
    }
  }
  setUpdateReq() {
    this.TransferRateRequest = {
      cities: this.selectedCityFC.value ?? [],
      origin_id: this.form.value.origin_id ?? '',
      destination_id: this.form.value.destination_id ?? '',
      origin_airline_id: this.form.value.origin_airline_id ?? '',
      destination_airline_id: this.form.value.destination_airline_id ?? '',
      origin_time: this.form.value.origin_time ?? '',
      destination_time: this.form.value.destination_time ?? '',
      origin_flight_number: this.form.value.origin_flight_number ?? '',
      destination_flight_number: this.form.value.destination_flight_number ?? '',
      rates: [],
      singleEdit: true,
      checkin_tomorrow: this.checkin_tomorrow ? 1 : 0,
      checkout_yesterday: this.checkout_yesterday ? 1 : 0,
      adl_price: this.adl_priceFC.value,
      origin_date: moment(this.originDateFC.value).format('YYYY-MM-DD'),
      destination_date: moment(this.destination_dateFC.value).format('YYYY-MM-DD'),
      chd_price: this.chd_priceFC.value,
      inf_price: this.inf_priceFC.value,
      capacity: this.capacityFC.value,
    }
  }


}
