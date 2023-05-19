import { Component, OnInit } from '@angular/core';
import { AddComponent } from '../add/add.component';
import { debounce } from 'rxjs';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {
  id = ''
  infoData: any = {
    cities: [],
    origin_id: 0,
    destination_id: 0,
    origin_airline_id: 0,
    destination_airline_id: 0,
    origin_time: '',
    destination_time: '',
    origin_flight_number: '',
    destination_flight_number: '',
    rates: [],
    checkin_tomorrow: 0,
    checkout_yesterday: 0,
  };
  editData: any;
  showData = false;

  override ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? ''

    this.getInfoData();
  }


  getInfoData(): void {
    this.flightApi.getFlightEditPage(+this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.editData = res.data
        this.infoData = this.editData.flights;
        this.setValue()
        this.show = true;
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error);

    })
  }

  setValue() {
    this.selectedCityFC.setValue(this.infoData.cities)
    this.form.controls.origin_id.setValue(this.infoData.origin_id);
    this.form.controls.destination_id.setValue(this.infoData.destination_id);
    this.form.controls.origin_airline_id.setValue(this.infoData.origin_airline_id);
    this.form.controls.destination_airline_id.setValue(this.infoData.destination_airline_id);
    this.form.controls.origin_time.setValue(this.infoData.origin_time);
    this.form.controls.destination_time.setValue(this.infoData.destination_time);
    this.form.controls.origin_flight_number.setValue(this.infoData.origin_flight_number);
    this.form.controls.destination_flight_number.setValue(this.infoData.destination_flight_number);
    this.form.controls.checkin_tomorrow.setValue(this.infoData.checkin_tomorrow);
    this.form.controls.checkout_yesterday.setValue(this.infoData.checkout_yesterday);

    this.checkin_tomorrow = this.infoData.checkin_tomorrow === 0 ? false : true
    this.checkout_yesterday = this.infoData.checkout_yesterday === 0 ? false : true
    this.infoData.rates.forEach((item: any) => {
      this.addRow(item);
    });
    this.showData = true
  }


  getCity(id: number) {
    return this.editData.cities.find((y:any) => y.id === id).name
  }


  addRow(item: any = null) {
    const dates = this.fb.group({
      id: item ? item.id : null,
      adl_price: item ? item.adl_price : null,
      origin_date: item ? item.origin_date : null,
      destination_date: item ? item.destination_date : null,
      chd_price: item ? item.chd_price : null,
      inf_price: item ? item.inf_price : null,
      capacity: item ? item.capacity : null,
    });
    this.RatesForm.push(dates);
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

  updateRequest() {
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
      rates: this.convertDateList(),
      checkin_tomorrow: this.checkin_tomorrow ? 1 : 0,
      checkout_yesterday: this.checkout_yesterday ? 1 : 0
    }
  }


}
