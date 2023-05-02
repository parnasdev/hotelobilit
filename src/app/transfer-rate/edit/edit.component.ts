import { Component, OnInit } from '@angular/core';
import { CityListRequestDTO, CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { TransferListDTO, TransferListRequestDTO } from 'src/app/Core/Models/transferDTO';
import { TransferRateDTO } from 'src/app/Core/Models/transferRateDTO';
import { AddComponent } from '../add/add.component';
import { EditTransferPageDTO, SetTransferPageDTO } from 'src/app/Core/Models/newTransferDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {

  flight_id = 0;
  cityID = 0;
  isShow = false

  info: EditTransferPageDTO = {
    airlines: [],
    cities: [],
    flight: {
      id: 0,
      user_id: 0,
      origin_id: 0,
      destination_id: 0,
      airline_id: 0,
      date: '',
      time: '',
      flight_number: '',
      adl_price: 0,
      chd_price: 0,
      inf_price: 0,
      capacity: 0,
      is_close: 0,
      description: '',
      deleted_at: '',
      created_at: '',
      updated_at: '',
    }
  }

  override ngOnInit(): void {
    //@ts-ignore
    this.flight_id = +this.route.snapshot.paramMap.get('id');
    this.getDataEditPage()
  }

   getDataEditPage(): void {
    const req: TransferListRequestDTO = {
      type: 1,
      search: null,
      paginate: false,
      perPage: 20
    }
    this.flightApi.getFlightEditPage(this.flight_id).subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.setValue();
        this.isShow = true;
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  editRequest(){
    this.setReq();
    this.editTransferRate();
  }

  setValue(): void {
    // @ts-ignore
    this.form.controls.origin_id.setValue(this.info.flight.origin_id);
    // @ts-ignore
    this.form.controls.destination_id.setValue(this.info.flight.destination_id);
    // @ts-ignore
    this.form.controls.airline_id.setValue(this.info.flight.airline_id);
    // @ts-ignore
    this.form.controls.date.setValue(this.info.flight.date);
    // @ts-ignore
    this.form.controls.time.setValue(this.info.flight.time);
    // @ts-ignore
    this.form.controls.flight_number.setValue(this.info.flight.flight_number);
    // @ts-ignore
    this.form.controls.adl_price.setValue(this.info.flight.adl_price);
    // @ts-ignore
    this.form.controls.chd_price.setValue(this.info.flight.chd_price);
    // @ts-ignore
    this.form.controls.inf_price.setValue(this.info.flight.inf_price);
    // @ts-ignore
    this.form.controls.capacity.setValue(this.info.flight.capacity);
    // @ts-ignore
    this.form.controls.is_close.setValue(this.info.flight.is_close);
    // @ts-ignore
    this.form.controls.description.setValue(this.info.flight.description);
  }

  editTransferRate(){
    this.isLoading = true
    this.flightApi.UpdateDataFlight(this.TransferRateRequest, this.flight_id).subscribe((res: any) => {
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

  getIncommingCity(id: number){
    return this.info.cities[0].categories.find(x => x.id === id)?.name
  }

}
