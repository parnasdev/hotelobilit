import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MessageService } from "../../Core/Services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import {  AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  transfer_id = 0
  nameFC = new FormControl();
  codeFC = new FormControl();
  statusFC = new FormControl();
  destCityFC = new FormControl();

  req: AirportReqDTO = {
    name: '',
    code: '',
    parent_id: 0,
  }
  info: any

  show = false;

  constructor(public message: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public dialog: MatDialog,
    public api: CategoryApiService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.transfer_id = +this.route.snapshot.paramMap.get('id')
    this.getInfo()
  }

  submit(): void {
    this.setReq()
    this.api.updateCategory(this.transfer_id, 'airplane', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/panel/airplane');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error)

    })
  }

  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
    this.api.editCategoryPage(this.transfer_id, 'airplane', 'hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        debugger
        this.setValue()
        this.show = true;
      } else {
        this.show = true;
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.show = true;
      this.message.error()
      this.checkError.check(error)

    })
  }

  setValue(): void {
    // this.logo = this.info.files.length > 0 ? this.info.files[0] : 0;
    this.nameFC.setValue(this.info.airplane.name)
    // this.codeFC.setValue(this.info.airport.code)
    // this.destCityFC.setValue(this.info.airport.parent_id)
  }


  setReq(): void {
    this.req = {
      parent_id: this.destCityFC.value,
      code: this.codeFC.value,
      name: this.nameFC.value,
    }
  }
}
