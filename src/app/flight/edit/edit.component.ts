import { Component } from '@angular/core';
import { IFlightCategory, IFlightEditReq } from '../core/models/flight.model';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { FlightApiService } from '../core/https/flight-api.service';
import { ActivatedRoute } from '@angular/router';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  id = '0'
  data: any;
  showForm = false
  isLoading = false
  req: IFlightEditReq = {
    origin_id: 0,
    destination_id: 0,
    airline_id: 0,
    airplane_id: 0,
    description: '',
    adl_price: 0,
    cabin_type: '',
    capacity: 0,
    chd_price: 0,
    date: '',
    flight_number: '',
    inf_price: 0,
    is_close: 0,
    time: ''
  }

  constructor(public api: FlightApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public message: MessageService,
    public error: ErrorsService) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '0'
    this.getData();
  }




  getData() {
    this.isLoading = true
    this.api.edit(+this.id).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.showForm = true
          this.data = res.data

        }
        this.isLoading = false
      }, error: (error: any) => {
        this.error.check(error);
        this.showForm = false
        this.isLoading = false
      }
    })
  }

  setData() {
    this.req = {
      origin_id: this.data,
      destination_id: 0,
      airline_id: 0,
      airplane_id: 0,
      description: '',
      adl_price: 0,
      cabin_type: '',
      capacity: 0,
      chd_price: 0,
      date: '',
      flight_number: '',
      inf_price: 0,
      is_close: 0,
      time: ''
    }
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
  getTime(time: any) {
    this.req.time = time.hour + ':' + time.minute
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
        this.req.date = result.fromDate.dateEn
      }
    })
  }

  submit(){ 

  }
}
