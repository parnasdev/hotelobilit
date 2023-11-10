import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../Core/Services/message.service";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  nameFC = new FormControl();
  nameEnFC = new FormControl();
  statusFC = new FormControl();
  req: any = {
    parent_id: 0,
    name: '',
  }

  data: any;
  show = false;

  cities: CityResponseDTO[] = []
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
  }

  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
  }



  submit(): void {

      this.setReq()
      this.api.storeCategory('airplane', 'hotel', this.req).subscribe((res: any) => {
        if (res.isDone) {
          this.router.navigateByUrl('/panel/airplane');
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
      name: this.nameFC.value,
    }
  }
}
