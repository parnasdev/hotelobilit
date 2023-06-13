import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CityListReq, CityListRes, SearchObjectDTO } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { DatesResDTO } from 'src/app/Core/Models/tourDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {
  @Output() onSubmit = new EventEmitter();
  @Input() inCommingSearchObject?: SearchObjectDTO;
  getDatesLoading = false;
  dateFC = new FormControl();
  isLoading = false;
  hasFlight = 1
  hasHotel = 1
  originCities: categoriesDTO[] | CityListRes[] = []
  destinationCities: categoriesDTO[] | CityListRes[] = []
  reservedDates: DatesResDTO[] = [];

  originFC = new FormControl('', Validators.required);
  destFC = new FormControl('', Validators.required);
  nightFC = new FormControl(0, Validators.required);
  stDateFC = new FormControl('', Validators.required);
  nights: number[] = []
  originID: number | null = null;

  minDate = new Date();

  fg: FormGroup = this.fb.group({
    origin: this.originFC,
    dest: this.destFC,
    night: this.nightFC,
    stDate: this.stDateFC,
  })

  constructor(
    public dialog: MatDialog,
    public error: ErrorsService,
    public cityApi: CityApiService,
    public fb: FormBuilder,
    public calendarService: CalenderServices,
    public message: MessageService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inCommingSearchObject']) {
      this.originFC.setValue(this.inCommingSearchObject?.origin ?? '')
      this.destFC.setValue(this.inCommingSearchObject?.dest ?? '')
      this.nightFC.setValue(this.inCommingSearchObject?.night ?? 1)
      this.stDateFC.setValue(this.inCommingSearchObject?.stDate ?? '')
      this.getReservedDates()
    }
  }

  ngOnInit() {
    this.getOriginCities();
    this.getDestinationCities()
  }

  search() {
    if (this.fg.invalid) {
      this.message.custom('جهت جستجو ورود اطلاعات الزامی است')
    } else {
      this.onSubmit.emit({
        origin: this.originFC.value,
        dest: this.destFC.value,
        stDate: this.stDateFC.value,
        night: this.nightFC.value
      })
    }

  }

  getOriginCities(): void {
    this.isLoading = true
    const req: CityListReq = {
      hasHotel: 0,
      hasFlight: 1,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      this.isLoading = false
      if (res.isDone) {
        this.originCities = res.data;
        // this.cities = this.cities.sort(function(x, y) {
        //   return Number(y.type) - Number(x.type);
        // })
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }

  getDestinationCities(): void {
    this.isLoading = true
    const req: CityListReq = {
      hasHotel: 1,
      hasFlight: 0,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      this.isLoading = false
      if (res.isDone) {
        this.destinationCities = res.data;
        // this.cities = this.cities.sort(function(x, y) {
        //   return Number(y.type) - Number(x.type);
        // })
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }

  originSelected(city: CityListRes): void {
    this.originFC.setValue(city.code)
    this.originID = city.id;
    if (this.destFC.valid) {
      this.getReservedDates();
    }
  }

  destSelected(city: CityListRes): void {
    this.destFC.setValue(city.code)
    this.reservedDates = [];
    this.inCommingSearchObject = undefined
    this.getReservedDates();
  }

  getReservedDates(): void {
    let originCode = this.originFC.value ?? '';
    let destCode = this.destFC.value ?? '';
    this.getDatesLoading = true;
    this.cityApi.getDates(originCode, destCode).subscribe((res: any) => {
      if (res.isDone) {
        this.reservedDates = res.data;
        if (this.inCommingSearchObject) {
          this.stDateFC.setValue(this.inCommingSearchObject.stDate)
        }
        this.nights = [];
        this.reservedDates.forEach(x => {
          if (this.nights.filter(item => item === x.night).length === 0) {
            this.nights.push(x.night);
          }
        });
      }
      this.getDatesLoading = false;
    }, (error: any) => {
      this.getDatesLoading = false;

      this.error.check(error)
    })
  }



  openPicker() {
    if (this.reservedDates.length > 0) {
      const dialog = this.dialog.open(PrsDatePickerComponent, {
        width: '70%',
        data: {
          dateList: this.reservedDates
        }
      })
      dialog.afterClosed().subscribe(res => {
        this.stDateFC.setValue(res.fromDate.dateFa)
        let itemFiltered = this.reservedDates.filter(x => x.date === (moment(res.fromDate.dateEn, 'YYYY/MM/DD').format('YYYY-MM-DD')))
        if (itemFiltered.length > 0) {
          this.nightFC.setValue(itemFiltered[0].night)
        }

      })
    } else {
      if(this.getDatesLoading ===true) {
this.message.custom('در حال دریافت اطلاعات  لطفا صبر کنید')
      }
      this.message.custom('در این مبدا و مقصد تور تعریف نشده است')
    }

  }
}
