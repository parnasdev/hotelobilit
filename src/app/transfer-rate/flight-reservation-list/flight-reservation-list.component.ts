import { Component } from '@angular/core';
import {ReserveListResponseDTO} from "../../Core/Models/reserveDTO";
import {Title} from "@angular/platform-browser";
import {ReserveApiService} from "../../Core/Https/reserve-api.service";
import {ActivatedRoute} from "@angular/router";
import {CheckErrorService} from "../../Core/Services/check-error.service";
import {CalenderServices} from "../../Core/Services/calender-service";
import {MatDialog} from "@angular/material/dialog";
import {SessionService} from "../../Core/Services/session.service";
import {ErrorsService} from "../../Core/Services/errors.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-flight-reservation-list',
  templateUrl: './flight-reservation-list.component.html',
  styleUrls: ['./flight-reservation-list.component.scss']
})
export class FlightReservationListComponent {
  isLoading = false;
  paginate: any;
  p = 1;
  paginateConfig: any;
  list: ReserveListResponseDTO[] = [];
flight: any
  status:any
  constructor(
    public title: Title,
    public api: ReserveApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public dialog: MatDialog,
    public session: SessionService,
    public errorService: ErrorsService,
    public message: MessageService) {
    route.queryParams.subscribe(params => {
      if(params) {
        this.flight = params['flight'];
        this.status = params['status'];
      }

    })

  }


  ngOnInit(): void {
    this.title.setTitle('رزرو ها | هتل و بلیط')

    this.getList()
  }
  getList(): void {
    this.isLoading = true;
    this.api.flightReserveList(this.p,this.flight,this.status).subscribe((res: any) => {
      if (res.isDone) {
        this.list = res.data
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getList();
  }

  getNights(checkin: string, checkout: string) {
    let nights = this.calService.enumerateDaysBetweenDates(checkin, checkout);

    return nights.length -1

  }
}
