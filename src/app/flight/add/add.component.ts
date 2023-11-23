import { Component } from '@angular/core';
import { IFlightCategory, IFlightCreate, IFlightStoreReq } from '../core/models/flight.model';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  showForm = false
  isLoading = false
  showMore = false
  airports:any[] = []
  tab = 'normal'
  isDomestic = false;
  form = this.fb.group({
    prices: this.fb.array([]),
  });
  req: IFlightStoreReq = {
    origin_id: 0,
    destination_id: 0,
    airline_id: 0,
    departure_flight_number: 0,
    return_flight_number: 0,
    airplane_id: 0,
    departure_time: '',
    return_time: '',
    departure_baggage: 0,
    return_baggage:0,
    dates: [],
    dayOfWeeks: [],
    departure_duration: '',
    return_duration: '',
    description: '',
    open_until: 240,
    prices: [],
  }


  weekDays: { name: string; isChecked: boolean }[] = []

  data: IFlightCreate = {
    airlines: [],
    airplanes: [],
    airports: [],
    cabinTypes: [],
    cities: [],
    dayOfWeeks: []
  }
  constructor(public api: FlightApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public message: MessageService,
    public error: ErrorsService) { }


  ngOnInit() {
    this.getData();
  }


  getData() {
    this.isLoading = true
    this.api.create().subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.showForm = true
          this.data = res.data
          this.airports = this.data.airports;
          this.changeCityType()
          this.data.dayOfWeeks.forEach(x => {
            this.weekDays.push({ isChecked: false, name: x })
          })
        }
        this.isLoading = false
      }, error: (error: any) => {
        this.error.check(error);
        this.showForm = false
        this.isLoading = false
      }
    })
  }

  changeCityType() {
    this.airports = []
    this.airports = this.data.airports.filter((x:any) => x.is_domestic === this.isDomestic)

  }

  getWeek() {
    let list: any[] = [];
    this.weekDays.forEach(x => {
      if (x.isChecked) {
        list.push(x.name)
      }
    })
    return list
  }

  setReq() {
    this.req.prices = this.PriceForm.value;
    this.req.dayOfWeeks = this.getWeek()
  }

  submit() {

    this.setReq()
    this.api.store(this.req).subscribe({
      next: (res: any) => {
        this.message.custom(res.message);
        this.router.navigateByUrl('/panel/flight/composition-list')

      }, error: (error: any) => {
        this.error.check(error);
      }
    })
  }

  addRow(obj: any | null = null) {
    const tabs = this.fb.group({
      cabin_type: obj?.cabin_type ?? [''],
      capacity: obj?.capacity ?? [''],
      adl_price: obj?.adl_price ?? [''],
      chd_price: obj?.chd_price ?? [''],
      inf_price: obj?.inf_price ?? ['']
    });
    this.PriceForm.push(tabs);
  }

  get PriceForm() {
    return this.form.controls["prices"] as FormArray;
  }

  removePrice(index: number) {
    this.PriceForm.removeAt(index)
  }

  getAirlines(item: IFlightCategory) {
    this.req.airline_id = item.id;
  }

  getOriginCity(item: IFlightCategory) {
    this.req.origin_id = item.id;

  }
  getDestCity(item: IFlightCategory) {
    this.req.destination_id = item.id
  }

  getAirplanes(item: IFlightCategory) {
    this.req.airplane_id = item.id
  }

  getCabinTypes(item: IFlightCategory) {
  }
  getDepartureTime(time: any) {
    this.req.departure_time = time.hour + ':' + time.minute
  }
  getReturnTime(time: any) {
    this.req.return_time = time.hour + ':' + time.minute

  }
  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.req.dates = [];
        this.req.dates.push(moment(result.fromDate.dateEn).format('YYYY-MM-DD'))
        this.req.dates.push(moment(result.toDate.dateEn).format('YYYY-MM-DD'))
      }
    })
  }


  setChildPrice(i:number) {
    debugger
    console.log(this.PriceForm);
    // @ts-ignore
    this.PriceForm.controls[i].controls['chd_price'].setValue(this.PriceForm.controls[i].controls['adl_price'].value)
  }
}
