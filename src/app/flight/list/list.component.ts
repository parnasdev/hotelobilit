import { Component } from '@angular/core';
import { IListButtons, IListModel } from 'src/app/Core/Models/dynamicList.model';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlightListReq } from '../core/models/flight.model';
import { PublicService } from 'src/app/Core/Services/public.service';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  isLoading = false;
  req: IFlightListReq = {
    destination: 0,
    fromDate: '',
    origin: 0,
    status: 0,
    toDate: ''
  }
  constructor(public api: FlightApiService,
    public error: ErrorsService,
    public router: Router,
    public route: ActivatedRoute,
    public publicService: PublicService,
    public message: MessageService) {

      route.queryParams.subscribe(params => {
        console.log(params);
        
this.data.filters[5].value = params['page'];
      })

  }
  data: IListModel = {
    pagination: {
      confiq: '',
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

  ngOnInit() {
    this.getData()
  }

  getFilterClicked(event: any) {
    this.data = event;
    this.getData()
  }

  getData() {
    this.isLoading = true;
    this.data.data = [];
    let qparams = this.publicService.getFiltersString(this.data.filters)
    this.api.list(qparams).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data.data = res.data
          this.data.filters[0].data = res.airports;
          this.data.filters[1].data = res.airports;
          this.data.filters[2].data = [{ id: 0, name: 'باز' }, { id: 1, name: 'بسته' }];
          this.data.pagination = {
            pageNumber: this.data.filters.find(x => x.key === 'page')?.value ?? 1,
            meta: res.meta,
            confiq: {
              itemsPerPage: res.meta?.per_page ?? 10,
              totalItems: res.meta?.total ?? 0,
              currentPage: res.meta?.current_page ?? 1
            }
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

  rowButtonClicked(event: { item: any, button: IListButtons }) {
    switch (event.button.name) {
      case 'حذف':
        // this.deleteClicked(event.item.id);
        return
      case 'ویرایش':
        this.router.navigateByUrl(`/panel/flight/edit/${event.item.id}`)
        return

    }
  }

  buttonClicked(event: IListButtons) {
    switch (event.name) {
      case 'add':
        return
    }
  }

  onFilterClicked(filters: any) {
    console.log(filters);

  }
}
