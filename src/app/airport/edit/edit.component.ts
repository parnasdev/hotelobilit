import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { TransferSetRequestDTO } from "../../Core/Models/transferDTO";
import { MessageService } from "../../Core/Services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TransferAPIService } from "../../Core/Https/transfer-api.service";
import { UploadSingleComponent } from "../../common-project/upload-single/upload-single.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirlineReqDTO } from 'src/app/Core/Models/newAirlineDTO';

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
  req: AirlineReqDTO = {
    name: '',
    code: '',
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
  }


  setReq(): void {
    this.logo.type = 1
    this.logo.id = null
    this.logo.alt = ''
    this.req.files.push(this.logo)
    this.req.name = this.nameFC.value
    this.req.code = this.codeFC.value
    // this.req = {
    //   files: [this.logo],
    //   name: this.nameFC.value,
    //   code: this.codeFC.value,
    // }
  }
}
