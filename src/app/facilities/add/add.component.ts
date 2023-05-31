import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  nameFC = new FormControl();
  req: any = {
    name: '',
    files: [],
  }
  images: UploadResDTO[] = [];

  data: any;
  show = false;

  // cityID = 0;

  constructor(public message: MessageService,
    public flightApi: FlightApiService,
    public router: Router,
    public dialog: MatDialog,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public api: CategoryApiService) { }

  ngOnInit(): void {
    this.getData();
  }



  getInfo(): void {
  }

  getImages(result: UploadResDTO[]): void {
    this.images = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? null,
        type: x.type
      }
      this.images.push(obj)
    })
  }


  getData(): void {
    this.api.createCategoryPage('service', 'hotel').subscribe((res: any) => {
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
    this.api.storeCategory('service', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.router.navigateByUrl('/panel/service');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error)

    })
  }

  setReq(): void {
    this.req = {
      name: this.nameFC.value,
      files: this.images
    }
  }
}
