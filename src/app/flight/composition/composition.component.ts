import { Component } from '@angular/core';
import { FlightApiService } from '../core/https/flight-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { IMixStepOneReq } from '../core/models/flight.model';
import { MatDialog } from '@angular/material/dialog';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-composition',
  templateUrl: './composition.component.html',
  styleUrls: ['./composition.component.scss']
})
export class CompositionComponent {
  data: { airlines: any[]; airports: any[] } = {
    airlines: [],
    airports: []
  }

  departureList: any[] = []
  returnList: any[] = []

  departureObj: IMixStepOneReq = {
    request_type: '',
    origin: 0,
    destination: 0,
    airline: null,
    stay_count: '',
    start_date: '',
    end_date: '',
    reset: false,
    checkin_tomorrow: false
  }
  ReturnObj: IMixStepOneReq = {
    request_type: '',
    origin: 0,
    destination: 0,
    airline: null,
    stay_count: '',
    start_date: '',
    end_date: null,
    reset: false,
    checkout_yesterday: false
  }

  constructor(public api: FlightApiService,
    public message: MessageService,
    public error: ErrorsService,
    public dialog: MatDialog,
    public publicService: PublicService) { }


  ngOnInit() {
    this.getData()
  }

  getData() {
    this.api.createMix().subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data
        } else {
          this.message.custom(res.message)
        }
      }, error: (error: any) => {
        this.error.check(error);
      }
    })
  }

  getDepartureOriginCity(city: any) {
    this.departureObj.origin = city
  }

  getDepartureDestCity(city: any) {
    this.departureObj.destination = city

  }

  getDepartureAirline(airline: any) {
    this.departureObj.airline = airline
  }

  getReturnOriginCity(city: any) {
    this.ReturnObj.origin = city
  }

  getReturnDestCity(city: any) {
    this.ReturnObj.destination = city
  }

  getReturnAirline(airline: any) {
    this.ReturnObj.airline = airline
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
        debugger
        // (result.fromDate.dateEn)
        this.departureObj.start_date = result.fromDate.dateEn
        this.departureObj.end_date = result.toDate.dateEn
      }
    })
  }

  getDepartureFlights(req:IMixStepOneReq,type ='departure') {
    this.api.mixStepOne(req).subscribe({
      next: (res: any) => {

      },error: (error:any) => {

      }
    })
  }
}
