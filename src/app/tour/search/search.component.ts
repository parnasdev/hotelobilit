import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CityListReq, CityListRes } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  dateFC = new FormControl();
  isLoading = false;
  hasFlight = 0
  hasHotel = 0
  cities: categoriesDTO[] | CityListRes[] = []

  constructor(
    public dialog: MatDialog,
    public cityApi: CityApiService,
    public message: MessageService,
    ) { }

  ngOnInit() {
    this.getCities();
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

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: this.dateFC.value
    })
    dialog.afterClosed().subscribe(res => {
      console.log(res)
      this.dateFC.setValue(res.fromDate.dateFa)
    })
  }
}
