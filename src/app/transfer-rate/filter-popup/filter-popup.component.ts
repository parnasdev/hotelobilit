import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { CityListRes } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';


export interface FilterDTO {
  origin: number | null;
  destination: number | null;
  status: number | null;
  airline: any
  agency:number|null;
  flight_number?: number | null;

  fromDate: string | null;
  toDate: string | null;
  q: string | null
}

@Component({
  selector: 'prs-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent implements OnInit {
  obj: FilterDTO = {
    destination: null,
    fromDate: null,
    airline: null,
    status: null,

    toDate: null,
    agency:null,

    q: null,
    origin: null
  }

  cities: categoriesDTO[] | CityListRes[] = []

  constructor(public dialogRef: MatDialogRef<FilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDTO,
    public error: ErrorsService,
    public api: CategoryApiService,
    public calendarService: CalenderServices,
    public message: MessageService,
    public dialog: MatDialog) {
    if (data) {

      this.obj = {
        destination: data.destination ? data.destination : null,
        fromDate: data.fromDate ? data.fromDate : null,
        toDate: data.toDate ? data.toDate : null,
        airline: data.airline ? data.airline : null,
        agency: data.agency ? data.agency : null,

        status: data.status ? data.status : null,
        origin: data.origin ? data.origin : null,
        q: data.q ? data.q : null,
      }
    }



  }
  ngOnInit(): void {
    // this.getTransfers()
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: []
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      this.obj.fromDate = res.fromDate.dateEn
      this.obj.toDate = res.toDate.dateEn

    })
  }


  submit() {
    this.dialogRef.close(this.obj)
  }


  removeFilter() {
    this.obj = {
      destination: null,
      fromDate: null,
      toDate: null,
      airline:null,
      status: null,
      q: null,
      origin: null,
      agency: null
    }
    this.dialogRef.close(this.obj)
  }
}
