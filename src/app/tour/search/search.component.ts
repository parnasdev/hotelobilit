import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CityListReq, CityListRes, SearchObjectDTO } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
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
  dateFC = new FormControl();
  isLoading = false;
  hasFlight = 0
  hasHotel = 0
  cities: categoriesDTO[] | CityListRes[] = []

  originFC = new FormControl('', Validators.required);
  destFC = new FormControl('', Validators.required);
  nightFC = new FormControl(1, Validators.required);
  stDateFC = new FormControl('', Validators.required);
  // reservedDates: DatesResDTO[] = [];
  nights: number[] = []
  originID: number | null = null;

  minDate = new Date();

  constructor(
    public dialog: MatDialog,
    public cityApi: CityApiService,
    public calendarService: CalenderServices,
    public message: MessageService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inCommingSearchObject']) {
      this.originFC.setValue(this.inCommingSearchObject?.origin ?? '')
      this.destFC.setValue(this.inCommingSearchObject?.dest ?? '')
      this.nightFC.setValue(this.inCommingSearchObject?.night ?? 1)
      this.stDateFC.setValue(this.inCommingSearchObject?.stDate ?? '')
    }
  }

  ngOnInit() {
    this.getCities();
  }

  search() {
    this.onSubmit.emit({
      origin: this.originFC.value,
      dest: this.destFC.value,
      stDate: this.stDateFC.value,
      night: this.nightFC.value
    })
  }

  getCities(): void {
    this.isLoading = true
    const req: CityListReq = {
      hasHotel: this.hasHotel ? 1 : 0,
      hasFlight: this.hasFlight ? 1 : 0,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      this.isLoading = false
      if (res.isDone) {
        this.cities = res.data;
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
    // if (this.destFC.valid) {
    //   this.getReservedDates();
    // }
  }

  destSelected(city: CityListRes): void {
    this.destFC.setValue(city.code)
    // this.reservedDates = [];
    this.inCommingSearchObject = undefined
    // this.getReservedDates();
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: this.dateFC.value
    })
    dialog.afterClosed().subscribe(res => {
      console.log(res)
      this.stDateFC.setValue(res.fromDate.dateFa)
    })
  }
}
