import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import {Title} from "@angular/platform-browser";
import * as moment from 'moment';

@Component({
  selector: 'prs-reserve-info',
  templateUrl: './reserve-info.component.html',
  styleUrls: ['./reserve-info.component.scss']
})
export class ReserveInfoComponent {
  info: any;
  statusFC = new FormControl()
  statuses: any[] = []
  isLoading = false
  reserve: string = ""
  constructor(
    public title: Title,
    public api: ReserveApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calendarService: CalenderServices,
    public dialog: MatDialog,
    public permition: PermitionsService,
    public session: SessionService,
    public errorService: ErrorsService,
    public message: MessageService) { }


  ngOnInit(): void {
    this.reserve = this.route.snapshot.paramMap.get('reserve') ?? '';
    this.title.setTitle('جزییات رزرو | هتل و بلیط')

    this.getReserve()
  }


  getReserve(): void {
    this.isLoading = true;
    this.api.getReserve(+this.reserve).subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.statuses = res.statuses;

        let statusFiltered = this.statuses.filter(x => x.name === this.info.information.status.label)
        if(statusFiltered.length > 0) {
          this.statusFC.setValue(statusFiltered[0].id)

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


  getPrices(item:any) {
    let list:any[] =[]
    for (var key in item.prices) {
      if (item.prices.hasOwnProperty(key)) {
          console.log(key + " -> " + item.prices[key]);
          list.push({name: key,value:item.prices[key]})
      }
  }
  return list
  }

  changeStatus() {
    this.isLoading = true;
    this.api.editReserve(+this.reserve, this.statusFC.value).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
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


  getNight(item: any) {
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
    return this.calendarService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
  }

  getPassengerCount() {
    let count:number = 0
   this.info.selected_rooms.forEach((x:any) => {
    count += x.passengers.length
   })
   return count
  }


  getServicePrices(room:any) {
    let servicePrice: number = 0;
    room.services.forEach((x:any) => {
      servicePrice += x.rate
    })
    return servicePrice
  }

}
