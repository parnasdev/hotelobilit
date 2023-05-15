import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
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
  codeFC = new FormControl();
  statusFC = new FormControl();
  req: AirportReqDTO = {
    parent_id: 0,
    name: '',
    code: '',
    airports: []
  }

  data: any;
  show = false;

  cities: CityResponseDTO[] = []
  // cityID = 0;
  destCityFC = new FormControl();
  type: string = 'country'
  selectedAirportFC = new FormControl([]);

  constructor(public message: MessageService,
    public flightApi: FlightApiService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public api: CategoryApiService) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') ?? 'country';
    this.getData();
  }

  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
  }

  getData(): void {
    this.api.createCategoryPage('city', 'hotel').subscribe((res: any) => {
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
    this.api.storeCategory('city', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.router.navigateByUrl('/panel/cities');
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
      parent_id: this.type === 'country' ? null : this.destCityFC.value,
      code: this.codeFC.value,
      name: this.nameFC.value,
      airports: this.selectedAirportFC.value ?? []
    }
  }
}
