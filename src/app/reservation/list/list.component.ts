import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { UserApiService } from 'src/app/Core/Https/user-api.service';
import { ReserveListResponseDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { Title } from "@angular/platform-browser";
import * as moment from 'moment';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  isLoading = false;
  paginate: any;
  p = 1;
  paginateConfig: any;
  list: any[] = [];

  constructor(
    public title: Title,
    public api: ReserveApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public dialog: MatDialog,
    public session: SessionService,
    public errorService: ErrorsService,
    public message: MessageService) { }


  ngOnInit(): void {
    this.title.setTitle('رزرو ها | هتل و بلیط')

    this.getList()
  }
  getList(): void {
    this.isLoading = true;
    this.list = [];
    this.api.list(this.p).subscribe((res: any) => {
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

  getNights(item: any) {
    if(item.flights.departure && item.flights.return) {
      let checkin = '';
    let checkout = ''
    let transfer = item.flights;
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
    return this.calService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
    }else {
      return '---'
    }
  }

  getPassengersCount(item: any) {
    let result = 0;
    if (item.selected_rooms.length > 0) {

    item.selected_rooms.forEach((x:any )=> {
      result += x.passengers.length
    })
    return result
    } else {
      return '---'
    }

  }
}
