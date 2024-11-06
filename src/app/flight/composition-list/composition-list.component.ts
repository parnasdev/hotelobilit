import { Component } from '@angular/core';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { IListFilters } from 'src/app/Core/Models/dynamicList.model';
import { PublicService } from 'src/app/Core/Services/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalenderServices } from "../../Core/Services/calender-service";
import * as moment from "moment/moment";
import { CityListRes } from 'src/app/Core/Models/newCityDTO';
import { MatDialog } from '@angular/material/dialog';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { CompositionUpdatePricePopupComponent } from '../composition-update-price-popup/composition-update-price-popup.component';
import {AlertDialogDTO} from "../../common-project/alert-dialog/alert-dialog.component";
import {AlertDialogComponent} from "../../shared/alert-dialog/alert-dialog.component";
export interface FilterCompositionDTO {
  origin: number | null;
  destination: number | null;
  status: number | null;
  stay_count: any;
  airline: number | null;
  mixed: boolean
  fromDate: string | null;
  toDate: string | null;
  q: string | null
  departure_flight_number:string | null;
  return_flight_number:string | null;
}
@Component({
  selector: 'prs-composition-list',
  templateUrl: './composition-list.component.html',
  styleUrls: ['./composition-list.component.scss']
})
export class CompositionListComponent {
  isLoading = false;
  list: any[] = []
  nights: any[] = [
    { id: 1, name: '۱ شب' },
    { id: 2, name: '۲ شب' },
    { id: 3, name: '۳ شب' },
    { id: 4, name: '۴ شب' },
    { id: 5, name: '۵ شب' },
    { id: 6, name: '۶ شب' },
    { id: 7, name: '۷ شب' },
    { id: 8, name: '۸ شب' },
    { id: 9, name: '۹ شب' },
  ];
  paginateConfig = {
    itemsPerPage: 0,
    totalItems: 0,
    currentPage: 0
  };
  itemsChecked: any[] = []
  checkAll = false
  paginate: any;
  p = 1; show = true;
  airports: any[] = []
  airplanes: any[] = []
  airlines: any[] = []
  statuses: any[] = []
  filterObj: FilterCompositionDTO = {
    destination: null,
    origin: null,
    airline: null,
    mixed: true,
    q: null,
    stay_count: null,
    status: 0,
    fromDate: null,
    toDate: null,
    departure_flight_number:null,
    return_flight_number:null
  };
  data: any[] = []
  constructor(public api: FlightApiService,
    public error: ErrorsService,
    public router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public calendarService: CalenderServices,
    public publicService: PublicService,
    public message: MessageService) {
    this.setFilterFromRoute()
  }

  isEmpty(obj: any) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }
  setFilterFromRoute() {
    this.route.queryParams.subscribe((params: any) => {
      if (!this.isEmpty(params)) {
        this.filterObj.destination = params['destination'] ? +params['destination'] : null
        this.filterObj.origin = params['origin'] ? +params['origin'] : null
        this.filterObj.q = params['q'] ? params['q'] : null
        this.filterObj.fromDate = params['fromDate']
        this.filterObj.airline = params['airline']
        this.filterObj.toDate = params['toDate']
        this.filterObj.departure_flight_number = params['departure_flight_number']
        this.filterObj.return_flight_number = params['return_flight_number']

        this.filterObj.stay_count = +params['stay_count']
      } else {
        this.filterObj = {
          destination: null,
          origin: null,
          q: null,
          airline: null,
          stay_count: null,
          mixed: true,
          status: 0,
          toDate: null,
          fromDate: null,
          departure_flight_number:null,
          return_flight_number:null
        }
      }
    })
  }


  ngOnInit() {
    this.getData()
  }

  originSelected(city: CityListRes): void {
    this.filterObj.origin = city.id
  }

  destSelected(city: CityListRes): void {
    this.filterObj.destination = city.id
  }


  checkItemChanged() {
    this.itemsChecked = []
    this.data.forEach(x => {
      if (x.isChecked) {
        this.itemsChecked.push(x.mixed_id);
      }
    })
    console.log(this.data,this.itemsChecked)
  }
  setCheckAll() {
    this.itemsChecked = []


    if (this.checkAll) {
      this.data.forEach(x => {
        x.isChecked = this.checkAll
        this.itemsChecked.push(x.mixed_id)
      })
    } else {
      this.data.forEach(x => {
        x.isChecked = this.checkAll
      })
    }
    console.log(this.data,this.itemsChecked)


  }
  getFilterList() {

    let result: any[] = []
    var obj: any = this.filterObj
    Object.keys(this.filterObj).forEach(function (key) {
      let filter: IListFilters = {
        data: '',
        label: '',
        type: '',
        value: obj[key] ? obj[key] : '',
        key: key,
        reqKey: key,
        keyValue: '',
        keyOption: '',
      }
      result.push(filter)
    });
    let pageItem: IListFilters = {
      data: '',
      label: '',
      type: '',
      value: this.p,
      key: 'page',
      reqKey: 'page',
      keyValue: '',
      keyOption: '',
    }
    result.push(pageItem)
    return result
  }


  deleteClicked() {
    const alertDialogObj: AlertDialogDTO = {
      description: 'حذف شود ؟',
      icon: '',
      title: 'ایا اطمینان دارید ؟'
    }
    this.dialog.open(AlertDialogComponent, {
      data: alertDialogObj
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.delete(id);
        this.delete()
      }
    })

  }

  delete(){

    let ids:any[] = this.itemsChecked
    let req={
      ids:ids
    }


    this.api.bulkMixedFlightDestroy(req).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.message.custom(res.message);
          this.getData()
          // this.dialogRef.close(true);
        }
      }, error: (error: any) => {
        this.error.check(error)
      }

    })
  }
  onPageChanged(event: any) {
    this.p = event;
    this.getData();
  }
  getData() {
    this.isLoading = true;
    this.data = []
    // debugger
    let qparams = this.publicService.getFiltersString(this.getFilterList())
    this.api.list(qparams).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data;
          if(this.airlines.length===0 || res.airlines.length !== this.airlines.length ){
            this.airlines = res.airlines;
          }
          this.airports = res.airports;
          this.statuses = [{ id: 0, name: 'باز' }, { id: 1, name: 'بسته' }];


          if (res.meta) {
            this.paginate = res.meta;
            this.paginateConfig = {
              itemsPerPage: this.paginate.per_page,
              totalItems: this.paginate.total,
              currentPage: this.paginate.current_page
            }
          }
        } else {
          this.message.custom(res.message)
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.error.check(error);
      },
      complete: () => {
      }
    })
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }

  removeFilter() {
    this.filterObj = {
      destination: null,
      fromDate: null,
      toDate: null,
      airline: null,
      stay_count: null,
      mixed: true,
      status: 0,
      q: null,
      origin: null,
      departure_flight_number:null,
      return_flight_number:null
    }
    this.router.navigate([`/panel/flight/composition-list`], {
      queryParams: this.filterObj
    })
    this.reload();
    this.getData()
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
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.filterObj.fromDate = res.fromDate.dateEn
        this.filterObj.toDate = res.toDate.dateEn;
      }
    })
  }

  updatePricing(item: any) {
    const dialog = this.dialog.open(CompositionUpdatePricePopupComponent, {
      width: '50%',
      data: {
        id: item.mixed_id,
        checkin_tomorrow: item.checkin_tomorrow,
        checkout_yesterday: item.checkout_yesterday,
        ignore: item.ignore === 1 ? true : false,
        total_adl_price: item.total_adl_price,
        total_chd_price: item.total_chd_price
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.getData()
      }
    })
  }

  submit() {
    this.p = 1
    this.router.navigate([`/panel/flight/composition-list/`], {
      queryParams: this.filterObj
    })
    this.getData()

  }



  calculateStayCount(transfer: any) {

    let checkin = '';
    let checkout = '';
    if (transfer.returnFlight) {
      if (!transfer.checkin_tomorrow && !transfer.checkout_yesterday) {
        checkin = transfer.flight.date;
        checkout = transfer.returnFlight.date;
      } else if (transfer.checkin_tomorrow && !transfer.checkout_yesterday) {
        checkin = moment(transfer.flight.date).add(1, 'days').format('YYYY-MM-DD');
        checkout = transfer.returnFlight.date;
      } else if (!transfer.checkin_tomorrow && transfer.checkout_yesterday) {
        checkin = transfer.flight.date;
        checkout = moment(transfer.returnFlight.date).add(-1, 'days').format('YYYY-MM-DD');
      } else {
        checkin = moment(transfer.flight.date).add(1, 'days').format('YYYY-MM-DD');
        checkout = moment(transfer.returnFlight.date).add(-1, 'days').format('YYYY-MM-DD');
      }
    }
    return this.calendarService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
  }
  setPagination(meta: any) {
    this.paginate = {
      pageNumber: this.p,
      meta: meta,
      confiq: {
        itemsPerPage: meta?.per_page ?? 10,
        totalItems: meta?.total ?? 0,
        currentPage: meta?.current_page ?? 1
      }
    }
  }

  getFilterResult(data: any) {
    this.p = 1
    this.router.navigate([`/panel/flight/composition-list`], {
      queryParams: this.filterObj
    })
    this.getData()
  }



  edit(id: number) {
    this.router.navigateByUrl(`/panel/flight/edit/${id}`).then(result => {
      window.open(`/panel/flight/edit/${id}`, '_blank');
    });

  }
}
