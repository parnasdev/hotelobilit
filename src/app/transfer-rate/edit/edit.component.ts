import { Component, OnInit } from '@angular/core';
import { CityListRequestDTO, CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { TransferListDTO, TransferListRequestDTO } from 'src/app/Core/Models/transferDTO';
import { TransferRateDTO } from 'src/app/Core/Models/transferRateDTO';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {

  id = '';
  cityID = 0;
  show = false;

  info: TransferRateDTO = {
    id: 0,
    adl_price: 0,
    capacity: 0,
    chd_price: 0,
    departure_date: '',
    departure_time: '',
    destination: {} as CityResponseDTO,
    destination_transfer: {} as TransferListDTO,
    destination_transfer_number: '',
    inf_price: 0,
    is_close: false,
    origin: {} as CityResponseDTO,
    origin_transfer: {} as TransferListDTO,
    origin_transfer_number: '',
    return_date: '',
    return_time: '',
    user: null
  }

  override ngOnInit(): void {
    //@ts-ignore
    this.id = this.route.snapshot.paramMap.get('id');
    this.getDataEditPage()
  }

   getDataEditPage(): void {
    const req: TransferListRequestDTO = {
      type: 1,
      search: null,
      paginate: false,
      perPage: 20
    }
    this.flightApi.getFlightRatesSet().subscribe((res: any) => {
      if (res.isDone) {
        this.pageData = res.data
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  editRequest(){
    this.setReq();
    this.editTransferRate();
  }

  getTransferRate(){
    this.isLoading = true
    this.show = false
    this.transferRateApi.getTransfer(+this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.show = true
        this.info = res.data;
        // this.getTransfer();
        this.setValue();
        this.isLoading = false
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }

  setValue(): void {
    // this.form.controls.origin_id.setValue(this.info.origin.id)
    // this.form.controls.destination_id.setValue(this.info.destination.id)
    // this.form.controls.origin_transfer_id.setValue(this.info.origin_transfer.id)
    // this.form.controls.destination_transfer_id.setValue(this.info.destination_transfer.id)
    // this.form.controls.departure_date.setValue(this.info.departure_date)
    // this.form.controls.return_date.setValue(this.info.return_date)
    // this.form.controls.departure_time.setValue(this.info.departure_time)
    // this.form.controls.return_time.setValue(this.info.return_time)
    // this.originTime = this.info.departure_time;
    // this.destTime = this.info.return_time;
    // this.form.controls.origin_transfer_number.setValue(this.info.origin_transfer_number)
    // this.form.controls.destination_transfer_number.setValue(this.info.destination_transfer_number)
    // this.form.controls.adl_price.setValue(this.info.adl_price)
    // this.form.controls.chd_price.setValue(this.info.chd_price)
    // this.form.controls.inf_price.setValue(this.info.inf_price)
    // this.form.controls.capacity.setValue(this.info.capacity)
    // this.form.controls.is_close.setValue(this.info.is_close)
  }

  editTransferRate(){
    this.isLoading = true
    // this.transferRateApi.edit(this.TransferRateRequest, +this.id).subscribe((res: any) => {
    //   if (res.isDone) {
    //     this.isLoading = false;
    //     this.message.showMessageBig(res.message);
    //     this.errorService.clear();
    //     this.router.navigateByUrl('/panel/transferRate');
    //   }
    // }, (error: any) => {
    //   this.isLoading = false;
    //   if (error.status == 422) {
    //     this.errorService.recordError(error.error.data);
    //     this.markFormGroupTouched(this.form);
    //     this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
    //   } else {
    //     this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
    //   }
    //   this.checkError.check(error);
    // })
  }

}
