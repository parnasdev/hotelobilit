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
  filterObj: FilterDTO | null = {
    destination: null,
    origin: null,
    q: null,
    flightDate: null
  };
  p = 1;

  constructor(public api: FlightApiService,
    public flightApi: FlightApiService,
    public session: SessionService,
    public dialog: MatDialog,
    public permition: PermitionsService,
    public route: ActivatedRoute,
    public router: Router,
    public checkError: CheckErrorService,
    public calendarService: CalenderServices,
    public message: MessageService) {
    this.route.queryParams.subscribe((params: any) => {
      if(!this.isEmpty(params)) {
        this.filterObj = params;
      } else {
this.filterObj = null
      }
    })
  }

   isEmpty(obj:any) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {
    this.getTransfers();
  }
  setReq(): void {
    this.req = {
      origin: this.filterObj ? this.filterObj.origin : null,
      destination: this.filterObj ? this.filterObj.destination: null,
      flightDate: this.filterObj? this.filterObj.flightDate ? moment(this.filterObj.flightDate).format('YYYY-MM-DD') : null : null,
      q: this.filterObj ? this.filterObj.q : null
    }
  }
  getTransfers(): void {
    this.setReq();
    this.isLoading = true
    this.api.getTransferRates(this.p,this.req).subscribe((res: any) => {
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


  openFilter() {
    const dialog = this.dialog.open(FilterPopupComponent,
      {
        width: '50%',
        data: this.filterObj
      })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.filterObj = result;
        this.router.navigate([`/panel/transferRate/`], {
          queryParams: this.filterObj
        })
        this.getTransfers()
      }
    })
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getTransfers();
  }

}
