import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { UserApiService } from 'src/app/Core/Https/user-api.service';
import { ReserveListResponseDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import { SessionService } from 'src/app/Core/Services/session.service';

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
  passengers: any[] = [];
  reserve: string = ""
  constructor(public api: ReserveApiService,
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
    this.getReserve()
  }


  getReserve(): void {
    this.isLoading = true;
    this.api.getReserve(+this.reserve).subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.statuses = res.statuses;
        if( this.info.reserves.length > 0) {
          this.passengers = this.info.reserves[0].details
        }
        let statusFiltered = this.statuses.filter(x => x.name === this.info.status.label)
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


  getNight() {
    let list = this.calendarService.enumerateDaysBetweenDates(this.info.details.checkin, this.info.details.checkout)
    console.log(list.length - 1);
    return list.length - 1

  }
}
