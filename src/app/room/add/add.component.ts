import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { RoomReqDTO } from 'src/app/Core/Models/newRoomDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  nameFC = new FormControl();
  capacityFC = new FormControl();
  statusFC = new FormControl();
  req: RoomReqDTO = {
    Adl_capacity: 0,
    age_child: 0,
    chd_capacity:0,
    name: '',
    parent_id: null,
  }

  data: any;
  show = false;

  rooms: CityResponseDTO[] = []
  // cityID = 0;
  destCityFC = new FormControl();

  constructor(public message: MessageService,
              public flightApi: FlightApiService,
              public router: Router,
              public dialog: MatDialog,
              public checkError: CheckErrorService,
              public errorService: ErrorsService,
              public api: CategoryApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  getInfo(): void {
  }

  getData(): void {
    this.api.createCategoryPage('RoomType', 'hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error)
      
    })
  }

  submit(): void {
    this.setReq()
    this.api.storeCategory('RoomType', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.router.navigateByUrl('/panel/rooms');
      }else {
        this.message.custom(res.message);
      }
    },(error:any) => {
      this.message.error()
      this.checkError.check(error)
    })
  }

  setReq(): void {
    this.req = {
      Adl_capacity: this.capacityFC.value,
      age_child: 0,
      chd_capacity:0,
      name: this.nameFC.value,
      parent_id: null,
    }
  }
}
