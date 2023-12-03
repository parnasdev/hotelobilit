import { Component } from '@angular/core';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { IListFilters, IListModel } from 'src/app/Core/Models/dynamicList.model';
import { PublicService } from 'src/app/Core/Services/public.service';
import { Router } from '@angular/router';
import { CalenderServices } from "../../Core/Services/calender-service";
import * as moment from "moment/moment";

@Component({
  selector: 'prs-composition-list',
  templateUrl: './composition-list.component.html',
  styleUrls: ['./composition-list.component.scss']
})
export class CompositionListComponent {
  isLoading = false;
  list: any[] = []
  paginate: any;
  paginateConfig = {
    itemsPerPage: 20,
    totalItems: 20,
    currentPage: 1
  };
  p = 1

  data: IListModel = {
    pagination: {
      confiq: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1
      },
      meta: '',
      pageNumber: 1
    },
    props: [
      { name: 'checkbox', type: 'checkbox', col: '0.3fr', label: '---' },
      { name: 'origin_name', type: 'text', col: '1.5fr', label: 'مبدا' },
      { name: 'destination_name', type: 'text', col: '2fr', label: 'مقصد' },
      { name: 'airline_name', type: 'text', col: '1fr', label: 'ایرلاین' },
      { name: 'airplane', type: 'text', col: '1fr', label: 'هواپیما' },
      { name: 'date', type: 'date', col: '1fr', label: 'تاریخ' },
      { name: 'time', type: 'text', col: '1.5fr', label: 'ساعت' },
      { name: 'is_close', type: 'boolean', col: '0.2fr', label: 'وضعیت' },
      { name: 'flight_number', type: 'text', col: '1.5fr', label: 'شماره پرواز' },
      { name: 'setting', type: 'buttons', col: '2fr', label: 'تنظیمات' },
    ],
    data: '',
    isTrash: false,
    filterMode: 'horizontal',
    showTrash: true,
    buttons: [
      { name: 'add', label: 'افزودن', permission: '', link: '/panel/flight/add', icon: 'assets/img/panel/edit.png', children: [], isLink: true, style: 'btn-base w-100 fs-13 cursor-pointer', show: true },
      { name: 'mix', label: 'ترکیب', permission: '', link: '/panel/flight/composition', icon: 'assets/img/panel/add.png', children: [], isLink: true, style: 'btn-base w-100 fs-13 cursor-pointer', show: true },
      { name: 'mix', label: 'پرواز های ترکیب شده', permission: '', link: '/panel/flight/composition-list', icon: 'assets/img/panel/add.png', children: [], isLink: true, style: 'btn-base w-100 fs-13 cursor-pointer', show: true }
    ],
    filters: [
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'origin', label: 'شهر مبدا' },
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'destination', label: 'شهر مقصد' },
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'status', label: 'وضعیت' },
      { value: '', type: 'date', keyOption: '', data: [], reqKey: 'fromDate', label: 'تاریخ شروع' },
      { value: '', type: 'date', keyOption: '', data: [], reqKey: 'toDate', label: 'تاریخ پایان' },
      { value: 1, type: '', key: 'page', data: [], reqKey: 'page', label: '' },
      { value: true, type: '', key: 'name', data: [], reqKey: 'mixed', label: '' },
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'stay_count', label: 'تعداد شب' },


    ],
    rowButtons: [
      { name: 'حذف', label: '', permission: '', link: '', children: [], icon: 'assets/img/panel/delete.png', isLink: false, style: 'btn-red flex-x-center btn-delete fs-13 h-40 wpx-40', show: true },
      { name: 'ویرایش', label: '', permission: '', link: '/panel/flight/edit', children: [], icon: 'assets/img/panel/edit.png', isLink: false, style: 'btn-base flex-x-center btn-edit fs-13 h-40 wpx-40', show: true }
    ],
    label: 'لیست پرواز ها',
    emptyBox: {
      text: 'موردی یافت نشد',
      icon: ''
    }
  }
  constructor(public api: FlightApiService,
    public error: ErrorsService,
    public router: Router,
    public calendarService: CalenderServices,
    public publicService: PublicService,
    public message: MessageService) { }


  ngOnInit() {
    this.getData()
  }


  getData() {
    this.isLoading = true;
    this.data.data = []
    let qparams = this.publicService.getFiltersString(this.data.filters)
    // qparams = qparams + `&page=${parent}`
    this.api.list(qparams).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data.data = res.data
          this.data.filters[0].data = res.airports;
          this.data.filters[1].data = res.airports;
          this.data.filters[2].data = [{ id: 0, name: 'باز' }, { id: 1, name: 'بسته' }];
          this.data.filters[7].data = [
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
          if (res.data.length > 0) {
            this.setPagination(res.meta);
          }


        } else {
          this.message.custom(res.message)
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        // console.log('error');
        this.isLoading = false;
        this.error.check(error);
      },
      complete: () => {
        // console.log('complete');
      }
    })
  }



  calculateStayCount(transfer: any) {
    let checkin = '';
    let checkout = ''
    if (!transfer.checkin_tomorrow && !transfer.return_flight.checkout_yesterday) {
      checkin = transfer.date;
      checkout = transfer.return_flight.date;
    } else if (transfer.checkin_tomorrow && !transfer.return_flight.checkout_yesterday) {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = transfer.return_flight.date;
    } else if (!transfer.checkin_tomorrow && transfer.return_flight.checkout_yesterday) {
      checkin = transfer.date;
      checkout = moment(transfer.return_flight.date).add(-1, 'days').format('YYYY-MM-DD');
    } else {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = moment(transfer.return_flight.date).add(-1, 'days').format('YYYY-MM-DD');
    }
    return this.calendarService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
  }
  setPagination(meta: any) {
    this.data.pagination = {
      pageNumber: this.data.filters.find(x => x.key === 'page')?.value ?? 1,
      meta: meta,
      confiq: {
        itemsPerPage: meta?.per_page ?? 10,
        totalItems: meta?.total ?? 0,
        currentPage: meta?.current_page ?? 1
      }
    }
  }
  onPageChanged(event: any) {
    this.data.pagination.pageNumber = event
    this.data.filters.filter(x => x.key === 'page')[0].value = event
    this.p = event;
    this.getData();
  }

  getFilterResult(data: any) {
    this.data = data
    this.getData()
  }
  edit(id: number) {
    this.router.navigateByUrl(`/panel/flight/edit/${id}`)

  }
}
