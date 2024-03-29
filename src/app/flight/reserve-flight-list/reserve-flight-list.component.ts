import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { ReserveListResponseDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-reserve-flight-list',
  templateUrl: './reserve-flight-list.component.html',
  styleUrls: ['./reserve-flight-list.component.scss']
})
export class ReserveFlightListComponent {
  isLoading = false;
  paginate: any;
  p = 1;
  paginateConfig: any;
  list: any[] = [];
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

  getPassengerCount(rooms:any) {
    let count = 0;

    rooms.forEach((room :any)=> {
      count += room.passengers.length 
    });
return count
  }
}
