import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MessageService } from "../../Core/Services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UploadSingleComponent } from "../../common-project/upload-single/upload-single.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import {  AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';

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
    parent: 0,
    files: [],
  }
  logo: UploadResDTO = {
    id: null,
    path: '',
    url: '',
    alt: '',
    type: 1,
  };
  info: any

  constructor(public message: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    public errorService: ErrorsService,
    public dialog: MatDialog,
    public api: CategoryApiService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.transfer_id = +this.route.snapshot.paramMap.get('id')
    this.getInfo()
  }

  getLogo(res: any): void {
    if (res) {
      this.message.showMessageBig('فایل شما با موفقیت آپلود شد.');
      this.logo = res
    }
  }

  submit(): void {
    this.setReq()
    this.api.updateCategory(this.transfer_id, 'airport', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/panel/airport');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
    this.api.editCategoryPage(this.transfer_id, 'airport', 'hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.setValue()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getThumbnail(): void {
    const dialog = this.dialog.open(UploadSingleComponent, {});
    dialog.afterClosed().subscribe(result => {
      this.logo = result
    })
  }

  setValue(): void {
    this.logo = this.info.files.length > 0 ? this.info.files[0] : 0;
    this.nameFC.setValue(this.info.airline.name)
    this.codeFC.setValue(this.info.airline.code)
    this.destCityFC.setValue(this.info.airline.parent)

  }


  setReq(): void {
    this.logo.type = 1
    this.logo.id = null
    this.logo.alt = ''
    this.req = {
      parent: this.destCityFC.value,
      code: this.codeFC.value,
      name: this.nameFC.value,
      files: []
    }
    this.req.files.push(this.logo)

  }
}
