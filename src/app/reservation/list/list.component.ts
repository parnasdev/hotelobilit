import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { Title } from "@angular/platform-browser";
import * as moment from 'moment';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  isLoading = false;
  paginate: any;
  p = 1;
  statuses: any[] = []
  paginateConfig: any;
  list: any[] = [];
  filterObj: any = {
    phone: '',
    id_code: '',
    ref_code: '',
    dateFa: '',
    status: 'all',
    fromDateEn: '',
    toDateEn: ''
  }
  keyword = '';
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
    let params = `?status=${this.filterObj.status === 'all' ? '' : this.filterObj.status}&fromDate=${this.filterObj.fromDateEn}&toDate=${this.filterObj.toDateEn}&ref_code=${this.filterObj.ref_code}&phone=${this.filterObj.phone}&id_code=${this.filterObj.id_code}&page=${this.p}`
    this.api.list(params).subscribe((res: any) => {
      if (res.isDone) {
        this.list = res.data
        this.statuses = res.statuses;
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

    let nights = this.calService.enumerateDaysBetweenDates(item.hotel.checkin, item.hotel.checkout)

    return nights.length >0 ? nights.length -1 : 0

  }

  openPicker(type = 'departure') {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: true
      }
    })
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterObj.dateFa = result.fromDate.dateFa + ',' + result.toDate.dateFa


        this.filterObj.fromDateEn = result.fromDate.dateEn
        this.filterObj.toDateEn = result.toDate.dateEn

      }
    })
  }

  getPassengersCount(item: any) {
    let result = 0;
    if (item.selected_rooms.length > 0) {

      item.selected_rooms.forEach((x: any) => {
        result += x.passengers.length
      })
      return result
    } else {
      return '---'
    }

  }
  removeFilter() {
    this.filterObj = {
      phone: '',
      id_code: '',
      ref_code: '',
      dateFa: '',
      status: 'all',
      fromDateEn: '',
      toDateEn: ''
    }
    this.list = []
    this.getList()
  }

  getIsFilter() {
    return this.filterObj.status &&
      this.filterObj.phone &&
      this.filterObj.id_code &&
      this.filterObj.dateFa &&
      this.filterObj.fromDateEn &&
      this.filterObj.toDateEn
  }



}
