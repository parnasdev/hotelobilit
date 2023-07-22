import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CityListReq, CityListRes } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { AlertDialogDTO } from 'src/app/common-project/alert-dialog/alert-dialog.component';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';


export interface FilterDTO {
  origin: number | null;
  destination: number | null;
  flightDate: string | null;
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
    flightDate: null,
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
        flightDate: data.flightDate ? data.flightDate : null,
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
      this.obj.flightDate = res.fromDate.dateEn
    })
  }


  submit() {
    this.dialogRef.close(this.obj)
  }


  removeFilter() {
    this.obj = {
      destination: null,
      flightDate: null,
      q: null,
      origin: null
    }
    this.dialogRef.close(this.obj)
  }
}
