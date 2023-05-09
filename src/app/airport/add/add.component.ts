import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../Core/Services/message.service";
import {FormControl} from "@angular/forms";
import {TransferAPIService} from "../../Core/Https/transfer-api.service";
import {TransferSetRequestDTO} from "../../Core/Models/transferDTO";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirlineReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  nameFC = new FormControl();
  codeFC = new FormControl();
  statusFC = new FormControl();
  req: AirlineReqDTO = {
    name: '',
    code: '',
    files: [],
  }

  data: any;
  show = false;

  logo: UploadResDTO = {
    path: '',
    url: ''
  };

  cities: CityResponseDTO[] = []
  // cityID = 0;
  originCityFC = new FormControl();
  destCityFC = new FormControl();

  constructor(public message: MessageService,
              public flightApi: FlightApiService,
              public router: Router,
              public dialog: MatDialog,
              public errorService: ErrorsService,
              public api: CategoryApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  getLogo(res: any): void {
    if (res) {
      this.message.showMessageBig('فایل شما با موفقیت آپلود شد.');
      this.logo = res
    }
  }

  
  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getStCity(cityItemSelected: any): void {
    this.originCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
  }


  getData(): void {
    this.api.createCategoryPage('airport', 'hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }


  submit(): void {
    this.setReq()
    this.api.storeCategory('airline', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.router.navigateByUrl('/panel/transfer');
      }else {
        this.message.custom(res.message);
      }
    },(error:any) => {
      this.message.error()
    })
  }




  setReq(): void {
    this.req = {
      code: this.codeFC.value,
      name: this.nameFC.value,
      files: []
    }
  }
}
