import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { AirlineListDTO } from 'src/app/Core/Models/newAirlineDTO';
import { citiesDTO } from 'src/app/Core/Models/newPostDTO';
import { flightStoreDTO } from 'src/app/Core/Models/newTransferDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  data: {
    airlines: AirlineListDTO[],
    airports: AirlineListDTO[],
    cities: citiesDTO[]
  } = {
      airlines: [],
      airports: [],
      cities: []
    }

  selectedCityFC = new FormControl('');

  selectedCities: CityResponseDTO[] = []

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
  originTime = ''
  destTime = ''
  originTransferFC = new FormControl();
  destTransferFC = new FormControl();
  destCityTypeFC = new FormControl(true);

  CHDFlightRate = new FormControl('');
  ADLFlightRate = new FormControl('');
  INFFlightRate = new FormControl('');

  TransferRateRequest: flightStoreDTO = {
    cities: [],
    origin_id: '',
    destination_id: '',
    origin_airline_id: '',
    singleEdit: true,
    destination_airline_id: '',
    origin_time: '',
    destination_time: '',
    origin_flight_number: '',
    destination_flight_number: '',
    rates: [],
    checkin_tomorrow: 0,
    checkout_yesterday: 0
  }

  checkin_tomorrow: boolean = false;
  checkout_yesterday: boolean = false;

  show = false;
  type = 'add'

  showBox = false;
  searchFC = new FormControl('');

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
    origin_airline_id: new FormControl('', Validators.required),
    destination_airline_id: new FormControl('', Validators.required),
    origin_time: new FormControl('', Validators.required),
    destination_time: new FormControl('', Validators.required),
    origin_flight_number: new FormControl('', Validators.required),
    destination_flight_number: new FormControl('', Validators.required),
    rates: this.fb.array([]),
  });

  ngOnInit(): void {
    this.getData();
  }



  addDateRow() {
    const dates = this.fb.group({
      id: null,
      adl_price: null,
      origin_date: null,
      destination_date: null,
      chd_price: null,
      inf_price: null,
      capacity: null,
    });
    this.RatesForm.push(dates);
  }

  get RatesForm() {
    return this.form.get('rates') as FormArray;
  }


  removeDates(i: any) {

    this.RatesForm.removeAt(i);

  }

  getError(item: any, fieldName: string): any {
    return item.controls[fieldName].errors
  }

  getIsTouched(item: any, fieldName: string): any {
    return item.controls[fieldName].touched
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
    this.form.controls.destination_id.setValue(cityItemSelected.id);
  }

  getStCity(cityItemSelected: any): void {
    this.form.controls.origin_id.setValue(cityItemSelected.id);
  }


  getData(): void {
    this.flightApi.getFlightRatesSet().subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data
        this.cities = res.data.cities
        this.cities.forEach(item => {
          item.isChecked = false;
        })
        console.log(this.cities)
        this.show = true;
      }
    }, (error: any) => {
      this.message.error()
    })
  }


  getOriginTime(event: any): void {
    if (event) {
      this.originTime = event.hour + ':' + event.minute;
      this.form.controls.origin_time.setValue(this.originTime);
    }
  }

  getDestTime(event: any): void {
    if (event) {
      this.destTime = event.hour + ':' + event.minute;
      this.form.controls.destination_time.setValue(this.destTime);
    }
  }

  createTransferRate() {
    this.isLoading = true
    this.flightApi.storeDataFlight(this.TransferRateRequest).subscribe((res: any) => {
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

  createRequest(type: string) {
    this.type = type;
    this.setReq();
    this.createTransferRate();
  }

  convertDateList(): any {
    const result: any[] = []
    this.RatesForm.value.forEach((item: any) => {
      const obj = {
        id: this.type === 'edit' ? item.id : null,
        adl_price: item.adl_price,
        origin_date: this.calenderServices.convertDate(item.origin_date, 'en', 'YYYY-MM-DD'),
        destination_date: this.calenderServices.convertDate(item.destination_date, 'en', 'YYYY-MM-DD'),
        chd_price: item.chd_price,
        inf_price: item.inf_price,
        capacity: item.capacity,
      }
      result.push(obj)
    })
    return result
  }
  getCityName(id: number) {
    return this.data.cities.find((y: any) => y.id === id)?.name
  }

  changeChecked(city_id: any){
    this.selectedCities = [];
    this.selectedCities = this.selectedCities.concat(this.cities.filter(x => x.isChecked))
  }

  setReq() {
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

  getCities(){
    if(this.searchFC.value && this.searchFC.value !== ''){
      let word = this.searchFC.value ?? ''
      return this.cities.filter(x => x.name.includes(word))
    } else {
      return this.cities
    }
  }
}
