import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { FilterDTO, FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { CityListRes } from 'src/app/Core/Models/newCityDTO';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  req!: FilterDTO;
  transfers: transferRateListDTO[] = [];
  isLoading = false;
  paginate: any;
  paginateConfig: any;
  filterObj: FilterDTO = {
    destination: null,
    origin: null,
    q: null,
    flightDate: null
  };
  p = 1;

  show = true;

  cities: categoriesDTO[] | CityListRes[] = []

  constructor(public api: FlightApiService,
    public flightApi: FlightApiService,
    public session: SessionService,
    public dialog: MatDialog,
    public permition: PermitionsService,
    public route: ActivatedRoute,
    public router: Router,
    public CategoryApi: CategoryApiService,
    public checkError: CheckErrorService,
    public calendarService: CalenderServices,
    public message: MessageService) {
    this.route.queryParams.subscribe((params: any) => {
      if (!this.isEmpty(params)) {
        this.filterObj.destination = +params['destination']
        this.filterObj.origin = +params['origin']
        this.filterObj.q = params['q']
        this.filterObj.flightDate = params['flightDate']
      } else {
        this.filterObj = {
          destination: null,
          origin: null,
          q: null,
          flightDate: null
        }
      }
    })
  }

  isEmpty(obj: any) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    this.getTransfers();
    this.getTransfer();
  }

  setReq(): void {
    this.req = {
      origin: this.filterObj ? this.filterObj.origin : null,
      destination: this.filterObj ? this.filterObj.destination : null,
      flightDate: this.filterObj ? this.filterObj.flightDate ? moment(this.filterObj.flightDate).format('YYYY-MM-DD') : null : null,
      q: this.filterObj ? this.filterObj.q : null
    }
  }

  getTransfers(): void {
    this.setReq();
    this.isLoading = true
    this.api.getTransferRates(this.p, this.req).subscribe((res: any) => {
      this.isLoading = false
      if (res.isDone) {
        this.transfers = res.data;
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error);
      this.message.error()
    })
  }

  originSelected(city: CityListRes): void {
    this.filterObj.origin = city.id
  }

  destSelected(city: CityListRes): void {
    this.filterObj.destination = city.id
  }

  getTransfer(): void {
    this.CategoryApi.getCategoryList('airport', 'hotel', 1).subscribe((res: any) => {
      if (res.isDone) {
        this.cities = res.data;
      }
    }, (error: any) => {

      this.message.error()
    })
  }

  removeTransferRate(id: number) {
    this.flightApi.removeDataFlight(id).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.getTransfers();
      }
    }, (error: any) => {
      this.checkError.check(error);
    })
  }

  checkItemPermission(item: string) {
    return !!this.session.userPermissions.find(x => x.name === item)
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getTransfers();
  }

  submit() {
    this.router.navigate([`/panel/transferRate/`], {
      queryParams: this.filterObj
    })
    this.getTransfers()
  }


  removeFilter() {
    this.filterObj = {
      destination: null,
      flightDate: null,
      q: null,
      origin: null
    }
    this.router.navigate([`/panel/transferRate/`], {
      queryParams: this.filterObj
    })
    this.reload();
    this.getTransfers()
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: []
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      this.filterObj.flightDate = res.fromDate.dateEn
    })
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }


  calculate(transfer: transferRateListDTO) {
    let checkin = '';
    let checkout = ''
    if (!transfer.checkin_tomorrow && !transfer.checkout_yesterday) {
      checkin = transfer.date;
      checkout = transfer.flight.date;
    } else if (transfer.checkin_tomorrow && !transfer.checkout_yesterday) {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = transfer.flight.date;
    } else if (!transfer.checkin_tomorrow && transfer.checkout_yesterday) {
      checkin = transfer.date;
      checkout = moment(transfer.flight.date).add(-1, 'days').format('YYYY-MM-DD');
    } else {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = moment(transfer.flight.date).add(-1, 'days').format('YYYY-MM-DD');
    }
    return this.calendarService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length -1
  }
}
