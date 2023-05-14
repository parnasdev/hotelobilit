import { Component, OnInit } from '@angular/core';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import {transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  req!: any;
  transfers: transferRateListDTO[] = [];
  loading = false;
  paginate: any;
  paginateConfig: any;
  p = 1;

  constructor(public api: FlightApiService,
    public flightApi: FlightApiService,
    public session: SessionService,
    public checkError: CheckErrorService,
    public calendarService: CalenderServices,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.getTransfers();
  }

  getTransfers(): void {
    this.setReq();
    this.api.getTransferRates(this.p).subscribe((res: any) => {
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
      this.checkError.check(error);
      this.message.error()
    })
  }

  setReq(): void {
    this.req = {
      departure_date: null,
      dest: null,
      origin: null,
      paginate: true,
      return_date: null
    }
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

}
