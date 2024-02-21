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
export interface FilterCompositionDTO {
  origin: number | null;
  destination: number | null;
  status: number | null;
  stay_count: any;
  airline: number | null
  mixed: boolean
  fromDate: string | null;
  toDate: string | null;
  q: string | null
}
@Component({
  selector: 'prs-composition-list',
  templateUrl: './composition-list.component.html',
  styleUrls: ['./composition-list.component.scss']
})
export class CompositionListComponent {
  isLoading = false;
  list: any[] = []
  nights: any[] = []
  paginateConfig = {
    itemsPerPage: 0,
    totalItems: 0,
    currentPage: 0
  };
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
    toDate: null
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
          fromDate: null
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

  onPageChanged(event: any) {
    this.p = event;
    this.getData();
  }
  getData() {
    this.isLoading = true;
    this.data = []
    let qparams = this.publicService.getFiltersString(this.getFilterList())
    this.api.list(qparams).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data;
          this.airlines = res.airlines;
          this.airports = res.airports;
          this.statuses = [{ id: 0, name: 'باز' }, { id: 1, name: 'بسته' }];
          this.nights = [
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
      origin: null
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
    debugger
    this.router.navigate([`/panel/flight/composition-list/`], {
      queryParams: this.filterObj
    })
    this.getData()
  }



  calculateStayCount(transfer: any) {
    let checkin = '';
    let checkout = '';
    if (transfer.returnFlight) {
      if (!transfer.flight.checkin_tomorrow && !transfer.returnFlight.checkout_yesterday) {
        checkin = transfer.flight.date;
        checkout = transfer.returnFlight.date;
      } else if (transfer.flight.checkin_tomorrow && !transfer.returnFlight.checkout_yesterday) {
        checkin = moment(transfer.flight.date).add(1, 'days').format('YYYY-MM-DD');
        checkout = transfer.returnFlight.date;
      } else if (!transfer.flight.checkin_tomorrow && transfer.returnFlight.checkout_yesterday) {
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
    this.router.navigateByUrl(`/panel/flight/edit/${id}`)

  }
}
