import { Component } from '@angular/core';
import { FlightApiService } from '../core/https/flight-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { IMixId, IMixStepOneReq, IMixStepTwoReq, IMixedReq } from '../core/models/flight.model';
import { MatDialog } from '@angular/material/dialog';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import * as moment from 'moment';
import { Router } from '@angular/router';

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
  selectAll = false
  mixedLoading = false;
  compositionLoading = false

  departureLoading = false;
  returnLoading = false;

  departureList: any[] = []
  returnList: any[] = []

  stayCountList = [
    { id: 1, name: ' ۱ شب' },
    { id: 2, name: ' ۲ شب' },
    { id: 3, name: ' ۳ شب' },
    { id: 4, name: ' ۴ شب' },
    { id: 5, name: ' ۵ شب' },
    { id: 6, name: ' ۶ شب' },
    { id: 7, name: ' ۷ شب' },
    { id: 8, name: ' ۸ شب' },
    { id: 9, name: ' ۹ شب' },
  ]

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
  compositionReq: IMixStepTwoReq = {
    departure: {
      origin: 0,
      destination: 0,
      airline: null,
      stay_count: '',
      start_date: '',
      end_date: '',
      checkin_tomorrow: false,
    },
    return: {
      origin: 0,
      destination: 0,
      airline: null,
      checkout_yesterday: false,
    }
  }
  compositionData: any;
  constructor(public api: FlightApiService,
    public message: MessageService,
    public error: ErrorsService,
    public dialog: MatDialog,

    public calendar: CalenderServices,
    public router: Router,
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
    this.departureObj.origin = city.id
  }

  getDepartureDestCity(city: any) {
    this.departureObj.destination = city.id

  }

  getDepartureAirline(airline: any) {
    this.departureObj.airline = airline.id
  }

  getReturnOriginCity(city: any) {
    this.ReturnObj.origin = city.id
  }

  getReturnDestCity(city: any) {
    this.ReturnObj.destination = city.id
  }

  getStayCount(stay: any) {
    this.departureObj.stay_count = stay.id
  }

  getReturnAirline(airline: any) {
    this.ReturnObj.airline = airline.id
  }
  openPicker(type = 'departure') {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: true
      }
    })
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {

        if (type === 'departure') {
          this.departureObj.start_date = result.fromDate.dateEn
          this.departureObj.end_date = result.toDate.dateEn

        } else {
          this.ReturnObj.start_date = result.fromDate.dateEn
          this.ReturnObj.end_date = result.toDate.dateEn
        }

      }
    })
  }

  getFlights(type = 'departure') {
    let objReq: any;
    if (type === 'departure') {
      this.departureLoading = true
      this.departureList = [];
      this.departureObj.request_type = type;
      objReq = this.departureObj
    } else {
      this.returnLoading = true
      this.returnList = []
      this.ReturnObj.stay_count = this.departureObj.stay_count;
      this.ReturnObj.request_type = type;
      objReq = this.ReturnObj
    }
    this.api.mixStepOne(objReq).subscribe({
      next: (res: any) => {
        if (type === 'departure') {
          this.departureList = res.data;
        } else {
          this.returnList = res.data
        }

        this.returnLoading = false;
        this.departureLoading = false


      }, error: (error: any) => {
        this.returnLoading = false;
        this.departureLoading = false;
        this.error.check(error);
      }
    })
  }

  setCompositionReq() {
    this.compositionReq = {
      departure: {
        origin: this.departureObj.origin,
        destination: this.departureObj.destination,
        airline: this.departureObj.airline,
        stay_count: this.departureObj.stay_count,
        start_date: this.departureObj.start_date ?? '',
        end_date: this.departureObj.end_date,
        checkin_tomorrow: this.departureObj.checkin_tomorrow ?? false,
      },
      return: {
        origin: this.ReturnObj.origin,
        destination: this.ReturnObj.destination,
        airline: this.ReturnObj.airline,
        checkout_yesterday: this.ReturnObj.checkout_yesterday ?? false,
      }
    }
  }

  composition() {
    if (this.returnList.length > 0 && this.departureList.length > 0) {
      this.setCompositionReq()
      this.compositionLoading = true
      this.api.mixStepTwo(this.compositionReq).subscribe({
        next: (res: any) => {
          if (res.isDone) {
            this.compositionData = res.data
          }
          this.compositionLoading = false

        }, error: (error: any) => {
          this.compositionLoading = false

          this.error.check(error)
        }
      })
    } else {
      this.message.custom('امکان ترکیب وجود ندارد')
    }
  }

  calculateStayCount(transfer: any) {
    let checkin = '';
    let checkout = ''
    if (!transfer.departure.checkin_tomorrow && !transfer.return.checkout_yesterday) {
      checkin = transfer.departure.date;
      checkout = transfer.return.date;
    } else if (transfer.departure.checkin_tomorrow && !transfer.return.checkout_yesterday) {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = transfer.flight.date;
    } else if (!transfer.departure.checkin_tomorrow && transfer.return.checkout_yesterday) {
      checkin = transfer.date;
      checkout = moment(transfer.departure.date).add(-1, 'days').format('YYYY-MM-DD');
    } else {
      checkin = moment(transfer.departure.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = moment(transfer.return.date).add(-1, 'days').format('YYYY-MM-DD');
    }
    return this.calendar.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
  }


  getCompositionIds() {
    let result: IMixId[] = []
    // let pivots: IMixId[] = []
    this.compositionData.forEach((element: any) => {
      if (element.isChecked && !element.is_mix) {
        let obj: IMixId = {
          checkin_tomorrow: this.departureObj.checkin_tomorrow ?? false,
          checkout_yesterday: this.ReturnObj.checkout_yesterday ?? false,
          departure_id: element.departure.id,
          return_id: element.return.id,
          ignore: element.ignore ?? false
        }
        result.push(obj);
      }

    });

    // this.compositionData.forEach((x: any) => {
    //   if (x.mixed_pivot) {
    //     pivots.push(x.mixed_pivot);
    //   }
    // })
    // result = result.concat(pivots)
    return result
  }
  selectAllChanged() {
    this.compositionData.forEach((x: any) => {
      if(!x.is_mix) {
        x.isChecked = this.selectAll
      }
    })
  }

  compositionSubmit() {
    this.mixedLoading = true
    let req: IMixedReq = {
      ids: this.getCompositionIds()
    }
    
    this.api.mixed(req).subscribe({
      next: (res: any) => {
        this.message.custom(res.message);
        this.router.navigateByUrl('/panel/flight/composition-list')
        this.mixedLoading = false
      }, error: (error: any) => {
        this.mixedLoading = false
        this.error.check(error)
      }
    })
  }
}
