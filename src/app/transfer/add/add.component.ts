import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../Core/Services/message.service";
import {FormControl} from "@angular/forms";
import {TransferAPIService} from "../../Core/Https/transfer-api.service";
import {TransferSetRequestDTO} from "../../Core/Models/transferDTO";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  nameFC = new FormControl();
  statusFC = new FormControl();
  req!: TransferSetRequestDTO
  logo: UploadResDTO = {
    path: '',
    url: ''
  };

  constructor(public message: MessageService,
              public router: Router,
              public dialog: MatDialog,
              public api: TransferAPIService) {}

  ngOnInit(): void {}

  getLogo(res: any): void {
    if (res) {
      this.message.showMessageBig('فایل شما با موفقیت آپلود شد.');
      this.logo = res
    }
  }


  submit(): void {
    this.setReq()
    this.api.add(this.req).subscribe((res: any) => {
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
      logo: this.logo.path,
      name: this.nameFC.value,
      type: 1
    }
  }

}
