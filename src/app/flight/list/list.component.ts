import { Component } from '@angular/core';
import { IListButtons, IListFilters } from 'src/app/Core/Models/dynamicList.model';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlightListReq } from '../core/models/flight.model';
import { PublicService } from 'src/app/Core/Services/public.service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { FilterDTO } from 'src/app/transfer-rate/filter-popup/filter-popup.component';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { MatDialog } from '@angular/material/dialog';
import { CityListRes } from 'src/app/Core/Models/newCityDTO';
import { GroupChangePopupComponent } from '../group-change-popup/group-change-popup.component';
import { EditFastPopupComponent } from '../edit-fast-popup/edit-fast-popup.component';
import {AlertDialogDTO} from "../../common-project/alert-dialog/alert-dialog.component";
import {AlertDialogComponent} from "../../shared/alert-dialog/alert-dialog.component";

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
  show = true;
  filterObj: FilterDTO = {
    destination: null,
    origin: null,
    q: null,
    airline: null,
    status: 0,
    fromDate: null,
    toDate: null,
    agency: null,

  };
  p = 1;

  itemsChecked: any[] = []
  checkAll = false
  data: any[] = [];
  paginate: any;
  paginateConfig= {
    itemsPerPage: 0,
    totalItems: 0,
    currentPage: 0
  };
  airports: any[] = []
  airlines: any[] = []
  airplanes: any[] = []
  agencies: any[] = []

  constructor(public api: FlightApiService,
    public error: ErrorsService,
    public router: Router,
    public dialog: MatDialog,
    public calendarService: CalenderServices,
    public route: ActivatedRoute,
    public permition: PermitionsService,
    public publicService: PublicService,
    public message: MessageService) {

    this.setFilterFromRoute()

    console.log('role', )


  }

  setFilterFromRoute() {
    this.route.queryParams.subscribe((params: any) => {
      if (!this.isEmpty(params)) {
        this.filterObj.destination = params['destination'] ? +params['destination'] : null
        this.filterObj.origin = params['origin'] ? +params['origin'] : null
        this.filterObj.q = params['q'] ? params['q'] : null
        this.filterObj.fromDate = params['fromDate']
        this.filterObj.toDate = params['toDate']
        this.filterObj.airline = +params['airline']
        this.filterObj.agency = +params['agency']
      } else {
        this.filterObj = {
          destination: null,
          origin: null,
          q: null,
          airline: null,
          status: 0,
          toDate: null,
          fromDate: null,
          agency: null,
        }
      }
    })
  }

  isEmpty(obj: any) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
    this.getData()
  }

  getFilterClicked(event: any) {
    this.data = event;
    this.getData()
  }
  originSelected(city: CityListRes): void {
    this.filterObj.origin = city.id
  }

  destSelected(city: CityListRes): void {
    this.filterObj.destination = city.id
  }



  getFilterList() {
    let result: any[] = []
    var obj: any = this.filterObj
    Object.keys(this.filterObj).forEach(function (key) {
      let filter: IListFilters = {
        data: '',
        label: '',
        type: '',
        value: obj[key] ? obj[key] : '',
        key: key,
        reqKey: key,
        keyValue: '',
        keyOption: '',
      }
      result.push(filter)
    });
    let pageItem: IListFilters = {
      data: '',
      label: '',
      type: '',
      value: this.p,
      key: 'page',
      reqKey: 'page',
      keyValue: '',
      keyOption: '',
    }
    result.push(pageItem)
    return result
  }
  getData() {
    this.isLoading = true;
    this.data = [];
    let qparams = this.publicService.getFiltersString(this.getFilterList())
    this.api.list(qparams).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.isDone) {
          this.data = res.data
          this.airports = res.airports;
          this.airlines = res.airlines
          this.airplanes = res.airplanes
          this.agencies = res.agencies
          if (res.meta) {
            this.paginate = res.meta;
            if (this.paginate) {
              this.paginateConfig = {
                itemsPerPage: this.paginate.per_page,
                totalItems: this.paginate.total,
                currentPage: this.paginate.current_page
              }
            }
          }


          this.setFilterFromRoute()
        } else {
          this.message.custom(res.message)
        }
      },
      error: (error: any) => {

        this.isLoading = false;
        this.error.check(error);
      },
      complete: () => {
      }
    })
  }
  getItemsChecked() {
    let list: any[] = []
    this.itemsChecked.forEach((element: any) => {
      list.push(element.id)
    });
    return list
  }

  delete(){
    console.log(this.getItemsChecked())
let ids:any[] = this.getItemsChecked()
    let req={
      ids:ids
    }


    this.api.bulkDestroy(req).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.message.custom(res.message);
          this.getData()
          // this.dialogRef.close(true);
        }
      }, error: (error: any) => {
        this.error.check(error)
      }

    })
  }


  deleteClicked() {
    const alertDialogObj: AlertDialogDTO = {
      description: 'حذف شود ؟',
      icon: '',
      title: 'ایا اطمینان دارید ؟'
    }
    this.dialog.open(AlertDialogComponent, {
      data: alertDialogObj
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.delete(id);
        this.delete()
      }
    })

  }

  submit() {
    this.p = 1
    this.router.navigate([`/panel/flight/`], {
      queryParams: this.filterObj
    })
    this.getData()
  }

  setCheckAll() {
    this.itemsChecked = []

    if (this.checkAll) {
      this.data.forEach(x => {
        x.isChecked = this.checkAll
        this.itemsChecked.push(x)
      })
    } else {
      this.data.forEach(x => {
        x.isChecked = this.checkAll
      })
    }

  }

  checkItemChanged() {
    this.itemsChecked = []
    this.data.forEach(x => {
      if (x.isChecked) {
        this.itemsChecked.push(x);
      }
    })
  }

  openGroupChange() {
    this.dialog.open(GroupChangePopupComponent, {
      data: {
        items: this.itemsChecked,
        airline: this.airlines,
        airports: this.airports,
        airplanes: this.airplanes
      },
      width: '90%',
      height: '80%'
    }).afterClosed().subscribe(result => {
      if (result) {

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

  }

  onPageChanged(event: any) {
    this.p = event;
    this.getData();
  }


  removeFilter() {
    this.filterObj = {
      destination: null,
      fromDate: null,
      toDate: null,
      airline: null,
      status: 0,
      q: null,
      agency:null,
      origin: null
    }
    this.router.navigate([`/panel/flight/`], {
      queryParams: this.filterObj
    })
    this.reload();
    this.getData()
  }

  fastEdit(id: number) {
    const dialog = this.dialog.open(EditFastPopupComponent, {
      data: id,
      width: '80%',
      height: '80%'
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    })
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }
  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.filterObj.fromDate = res.fromDate.dateEn
        this.filterObj.toDate = res.toDate.dateEn;
      }

    })
  }

}
