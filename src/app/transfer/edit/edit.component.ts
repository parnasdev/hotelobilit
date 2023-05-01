import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { TransferSetRequestDTO } from "../../Core/Models/transferDTO";
import { MessageService } from "../../Core/Services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TransferAPIService } from "../../Core/Https/transfer-api.service";
import { UploadSingleComponent } from "../../common-project/upload-single/upload-single.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  slug = ''
  nameFC = new FormControl();
  statusFC = new FormControl();
  req!: TransferSetRequestDTO
  logo: UploadResDTO = {
    path: '',
    url: ''
  };
  info: any

  constructor(public message: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public api: TransferAPIService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.slug = this.route.snapshot.paramMap.get('slug')
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
    this.api.edit(this.req, this.slug).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/panel/transfer');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getInfo(): void {
    this.api.getTransfer(this.slug).subscribe((res: any) => {
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
    this.logo = this.info.logo;
    this.nameFC.setValue(this.info.name)
  }


  setReq(): void {
    this.req = {
      logo: this.logo.path,
      name: this.nameFC.value,
      type: 1
    }
  }

}
