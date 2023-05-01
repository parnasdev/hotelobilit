import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { TransferAPIService } from 'src/app/Core/Https/transfer-api.service';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { CityListRequestDTO, CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { TransferListRequestDTO } from 'src/app/Core/Models/transferDTO';
import { TransferRateSetReqDTO } from 'src/app/Core/Models/transferRateDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  isMobile: any;
  isLoading = false;
  minDate = new Date(); //datepicker

  capacityFlightRate = new FormControl(0);

  cities: CityResponseDTO[] = []
  // cityID = 0;
  originCityFC = new FormControl();
  destCityFC = new FormControl();

  originDateFC = new FormControl();
  originTimeFC = new FormControl();
  destDateFC = new FormControl();
  destTimeFC = new FormControl();

  originFlightCodeFC = new FormControl();
  destFlightCodeFC = new FormControl();
  airlines: any[] = []
  originTime = ''
  destTime = ''
  originTransferFC = new FormControl();
  destTransferFC = new FormControl();
  destCityTypeFC = new FormControl(true);

  CHDFlightRate = new FormControl('');
  ADLFlightRate = new FormControl('');
  INFFlightRate = new FormControl('');

  TransferRateRequest: TransferRateSetReqDTO = {
    origin_id : 0,
    destination_id : 0,
    origin_transfer_id: 0,
    destination_transfer_id: 0,
    departure_date: '',
    return_date: '',
    departure_time: '',
    return_time: '',
    origin_transfer_number: '',
    destination_transfer_number: '',
    adl_price: '',
    chd_price: '',
    inf_price: '',
    capacity: '',
    is_close: false,
  }

  constructor(public message: MessageService,
              public fb: FormBuilder,
              public router: Router,
              public route: ActivatedRoute,
              public calenderServices: CalenderServices,
              public errorService: ErrorsService,
              public cityApi: CityApiService,
              public checkError: ErrorsService,
              public transferRateApi: TransferRateAPIService,
              public transferApi: TransferAPIService) {
  }

  form = this.fb.group({
    origin_id: new FormControl('', Validators.required),
    destination_id: new FormControl('', Validators.required),
    origin_transfer_id: new FormControl('', Validators.required),
    destination_transfer_id: new FormControl('', Validators.required),
    departure_date: new FormControl('', Validators.required),
    return_date: new FormControl('', Validators.required),
    departure_time: new FormControl('', Validators.required),
    return_time: new FormControl('', Validators.required),
    origin_transfer_number: new FormControl('', Validators.required),
    destination_transfer_number: new FormControl('', Validators.required),
    adl_price: new FormControl('', Validators.required),
    chd_price: new FormControl('', Validators.required),
    inf_price: new FormControl('', Validators.required),
    capacity: new FormControl('0', Validators.required),
    is_close: new FormControl('false', Validators.required),
  });

  ngOnInit(): void {
    this.getTransfer();
  }

  markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getCities(): void {
    const req: CityListRequestDTO = {
      type: null,
      hasHotel: true,
      hasOriginTour: false,
      search: null,
      hasDestTour: false,
      perPage: 20
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      if (res.isDone) {
        this.cities = res.data;
        this.form.controls.origin_id.setValue(this.cities[0].id.toString());
        this.form.controls.destination_id.setValue(this.cities[1].id.toString());
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getEndCity(cityItemSelected: any): void {
    this.form.controls.destination_id.setValue(cityItemSelected.id);
  }

  getStCity(cityItemSelected: any): void {
    this.form.controls.origin_id.setValue(cityItemSelected.id);
  }

  getTransfer(): void {
    const req: TransferListRequestDTO = {
      type: 1,
      search: null,
      paginate: false,
      perPage: 20
    }
    this.transferApi.getTransfers(req).subscribe((res: any) => {
      if (res.isDone) {
        this.airlines = res.data
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getOriginTime(event: any): void {
    if (event) {
      this.originTime = event.hour + ':' + event.minute;
      this.form.controls.departure_time.setValue(this.originTime);
    }
  }

  getDestTime(event: any): void {
    if (event) {
      this.destTime = event.hour + ':' + event.minute;
      this.form.controls.return_time.setValue(this.originTime);
    }
  }

  createTransferRate(){
    this.isLoading = true
    this.transferRateApi.add(this.TransferRateRequest).subscribe((res: any) => {
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

  createRequest(){
    this.setReq();
    console.log(this.TransferRateRequest);
    this.createTransferRate();
  }

  setReq(){
    // this.TransferRateRequest = {
    //   origin_id : this.form.value.origin_id,
    //   destination_id : this.form.value.destination_id,
    //   origin_transfer_id: this.form.value.origin_transfer_id,
    //   destination_transfer_id: this.form.value.destination_transfer_id,
    //   departure_date: this.calenderServices.convertDateSpecial(this.form.value.departure_date, 'en'),
    //   return_date: this.calenderServices.convertDateSpecial(this.form.value.return_date, 'en'),
    //   departure_time: this.form.value.departure_time,
    //   return_time: this.form.value.return_time,
    //   origin_transfer_number: this.form.value.origin_transfer_number,
    //   destination_transfer_number: this.form.value.destination_transfer_number,
    //   adl_price: this.form.value.adl_price,
    //   chd_price: this.form.value.chd_price,
    //   inf_price: this.form.value.inf_price,
    //   capacity: this.form.value.capacity,
    //   is_close: false,
    // }
  }

}
