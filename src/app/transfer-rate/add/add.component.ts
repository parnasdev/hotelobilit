import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { TransferAPIService } from 'src/app/Core/Https/transfer-api.service';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { CityListRequestDTO, CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { flightStoreDTO } from 'src/app/Core/Models/newTransferDTO';
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
  pageData: any;
  originTime = ''
  destTime = ''
  originTransferFC = new FormControl();
  destTransferFC = new FormControl();
  destCityTypeFC = new FormControl(true);

  CHDFlightRate = new FormControl('');
  ADLFlightRate = new FormControl('');
  INFFlightRate = new FormControl('');

  TransferRateRequest: flightStoreDTO = {
    origin_id: 0,
    destination_id: 0,
    airline_id: 0,
    date: 0,
    time: '',
    flight_number: 0,
    adl_price: 0,
    chd_price: 0,
    inf_price : 0,
    capacity: 0,
    is_close : 0,
    description : '',
  }

  show = false;

  constructor(public message: MessageService,
              public fb: FormBuilder,
              public router: Router,
              public route: ActivatedRoute,
              public calenderServices: CalenderServices,
              public errorService: ErrorsService,
              public cityApi: CityApiService,
              public checkError: ErrorsService,
              public transferRateApi: TransferRateAPIService,
              public flightApi: FlightApiService) {
  }

  form = this.fb.group({
    origin_id: new FormControl('', Validators.required),
    destination_id: new FormControl('', Validators.required),
    airline_id: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    flight_number: new FormControl('', Validators.required),
    adl_price: new FormControl('', Validators.required),
    chd_price: new FormControl('', Validators.required),
    inf_price: new FormControl('', Validators.required),
    capacity: new FormControl('0', Validators.required),
    is_close: new FormControl('0', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.getData();
  }

  markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getEndCity(cityItemSelected: any): void {
    debugger
    this.form.controls.destination_id.setValue(cityItemSelected.id);
  }

  getStCity(cityItemSelected: any): void {
    debugger
    this.form.controls.origin_id.setValue(cityItemSelected.id);
  }

  getData(): void {
    this.flightApi.getFlightRatesSet().subscribe((res: any) => {
      if (res.isDone) {
        this.pageData = res.data
        this.show = true;
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getOriginTime(event: any): void {
    if (event) {
      this.originTime = event.hour + ':' + event.minute;
      this.form.controls.time.setValue(this.originTime);
    }
  }

  createTransferRate(){
    this.isLoading = true
    this.flightApi.storeDataCreate(this.TransferRateRequest).subscribe((res: any) => {
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
    this.TransferRateRequest = {
      // @ts-ignore
      origin_id: this.form.value.origin_id,
      // @ts-ignore
      destination_id: this.form.value.destination_id,
      // @ts-ignore
      airline_id: this.form.value.airline_id,
      date: this.calenderServices.convertDateSpecial(this.form.value.date, 'en'),
      // @ts-ignore
      time: this.form.value.time,
      // @ts-ignore
      flight_number: this.form.value.flight_number,
      // @ts-ignore
      adl_price: this.form.value.adl_price,
      // @ts-ignore
      chd_price: this.form.value.chd_price,
      // @ts-ignore
      inf_price : this.form.value.inf_price,
      // @ts-ignore
      capacity: this.form.value.capacity,
      // @ts-ignore
      is_close : this.form.value.is_close,
      // @ts-ignore
      description : this.form.value.description,
    }
  }

}
