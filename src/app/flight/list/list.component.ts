import { Component } from '@angular/core';
import { IListButtons, IListModel } from 'src/app/Core/Models/dynamicList.model';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { Router } from '@angular/router';
import { IFlightListReq } from '../core/models/flight.model';

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
    public message: MessageService) {

  }
  data: IListModel = {
    pagination: {
      confiq: '',
      meta: '',
      pageNumber: 1
    },
    props: [
      { name: '---', type: 'checkbox', col: '0.3fr', label: '---' },
      { name: 'origin_name', type: 'text', col: '1.5fr', label: 'مبدا' },
      { name: 'destination_name', type: 'text', col: '2fr', label: 'مقصد' },
      { name: 'airline_name', type: 'text', col: '1fr', label: 'ایرلاین' },
      { name: 'airplane', type: 'text', col: '1fr', label: 'هواپیما' },
      { name: 'date', type: 'date', col: '1fr', label: 'تاریخ' },
      { name: 'time', type: 'text', col: '1.5fr', label: 'ساعت' },
      { name: 'is_close', type: 'text', col: '0.2fr', label: 'وضعیت' },
      { name: 'flight_number', type: 'text', col: '1.5fr', label: 'شماره پرواز' },
      { name: 'setting', type: 'buttons', col: '2fr', label: 'تنظیمات' },
    ],
    data: '',
    isTrash: false,
    filterMode: 'horizontal',
    showTrash: true,
    buttons: [{ name: 'افزودن', permission: '', link: '/panel/flight/add', icon: 'assets/img/panel/edit.png', children: [], isLink: true, style: 'btn-base-2 wpx-140 fs-13', show: true },
    { name: 'ترکیب', permission: '', link: '/panel/flight/composition', icon: 'assets/img/panel/add.png', children: [], isLink: true, style: 'btn-base wpx-140 fs-13', show: true }
  ],
    filters: [
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'origin', label: 'شهر مبدا' },
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'destination', label: 'شهر مقصد' },
      { value: '', type: 'select', keyValue: 'id', keyOption: 'name', data: [], reqKey: 'status', label: 'وضعیت' },
      { value: '', type: 'date', keyOption: '', data: [], reqKey: 'fromDate', label: 'تاریخ شروع' },
      { value: '', type: 'date', keyOption: '', data: [], reqKey: 'toDate', label: 'تاریخ پایان' },
    ],
    rowButtons: [
      { name: 'حذف', permission: '', link: '', children: [], icon: 'assets/img/panel/delete.png', isLink: false, style: 'btn-red flex-x-center btn-delete fs-13 h-40 wpx-40', show: true },
      { name: 'ویرایش', permission: '', link: '/panel/flight/edit', children: [], icon: 'assets/img/panel/edit.png', isLink: false, style: 'btn-base flex-x-center btn-edit fs-13 h-40 wpx-40', show: true }
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

  getData() {
    this.isLoading = true;
    this.api.list(this.data.filters).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data.data = res.data
          this.data.filters[0].data = res.cities;
          this.data.filters[1].data = res.cities;
          this.data.filters[2].data = [{id:0,name:'باز'},{id:1,name:'بسته'}]
          // this.data.filters[4].data = res.airlines;

          this.data.pagination = {
            pageNumber: 1,
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


  onPageChanged(pageNum: number) {
    this.getData();
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
      case 'اضافه':
        return
    }
  }

  onFilterClicked(filters: any) {
    console.log(filters);

  }
}
