import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import * as jmoment from 'jalali-moment';

import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { SearchObjectDTO } from 'src/app/Core/Models/newCityDTO';
import { IDatesRes, ISearchDataRes } from '../core/models/tour.model';
import { Router } from '@angular/router';
import { TourApiService } from '../core/https/tour-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { PrsDateDialogPickerComponent } from 'src/app/date-picker/prs-date-dialog-picker/prs-date-dialog-picker.component';

@Component({
  selector: 'prs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() inCommingSearchObject?: SearchObjectDTO;
  isLoading = false
  isMobile = false;
  searchData: ISearchDataRes[] = [];
  isRefresh = true
  originFC = new FormControl('', Validators.required);
  destFC = new FormControl('', Validators.required);
  nightFC = new FormControl(1, Validators.required);
  stDateFC = new FormControl('', Validators.required);
  reservedDates: IDatesRes[] = [];
  destinations: ISearchDataRes[] = []


  originCityObj: ISearchDataRes = {
    destinations: [],
    id: 0,
    name: '',
    code: '',
  }
  destCityObj: ISearchDataRes = {
    dates: [],
    id: 0,
    name: '',
    code: '',
  }

  isError = false;
  isOriginEmpty = false;
  isDestEmpty = false
  constructor(public cityApiService: CityApiService,
    public router: Router,
    public api: TourApiService,
    public publicService: PublicService,
    public cityApi: CityApiService,
    public dialog: MatDialog) {
  }

  nights: number[] = []

  ngOnInit(): void {
    this.getSearchData()
  }
  getSearchData() {
    this.isLoading = true;
    this.isError = false;
    this.isOriginEmpty = false;
    this.isDestEmpty = false;

    this.api.getActiveRoute().subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.searchData = res.data;
          if (this.searchData.length === 0) {
            this.isOriginEmpty = true;
          }
        } else {
          this.isError = true
        }
      }, error: (error: any) => {
        this.isLoading = false;
        this.isError = true

        this.publicService.error.check(error)
      }
    })

  }
  tryAgain() {
    this.getSearchData();
  }

  originSelected(city: ISearchDataRes): void {
    this.originFC.setValue(city.name)
    this.originCityObj = city

    this.destCityObj = {
      dates: [],
      id: 0,
      name: '',
      code: '',
    }
    this.destFC.setValue(null)
    this.destinations = city.destinations ?? [];
    if (this.destinations.length === 0) {
      this.isDestEmpty = true
    }
  }

  reload() {
    this.isRefresh = false;
    setTimeout(() => this.isRefresh = true);
  }
  destinationSelected(city: ISearchDataRes): void {
    this.destFC.setValue(city.name)
    this.destCityObj = city
    this.stDateFC.setValue(null)
    this.reservedDates = city.dates ?? [];


  }


  myFilter = (d: Date | null): boolean => {
    let list = this.reservedDates.filter(x => moment(x.date, 'YYYY-MM-DD').isSame(moment(d, 'YYYY-MM-DD')))
    if (list.length > 0) {
      this.nights = list[0].nights;
      this.nightFC.setValue(this.nights[0])
    }
    return list.length > 0;
  };

  openPicker() {
    const dialog = this.dialog.open(PrsDateDialogPickerComponent, {
      width: this.isMobile ? '90%' : '70%',
      data: {
        dateList: this.reservedDates
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      this.stDateFC.setValue(res.fromDate.dateFa)
      let itemFiltered = this.reservedDates.filter(x => x.date === (moment(res.fromDate.dateEn, 'YYYY/MM/DD').format('YYYY-MM-DD')))
      if (itemFiltered.length > 0) {
        this.nightFC.setValue(itemFiltered[0].nights[0])
        this.nights = [];
        this.nights = itemFiltered[0].nights;
      }
    })
  }


  search() {
    this.onSubmit.emit({
      origin: this.originCityObj.code,
      dest: this.destCityObj.code,
      stDate: jmoment(this.stDateFC.value??'','jYYYY-jMM-jDD').format('YYYY-MM-DD'),
      night: this.nightFC.value
    })
  }
}
