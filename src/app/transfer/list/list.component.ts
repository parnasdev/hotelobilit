import { Component, OnInit } from '@angular/core';
import { TransferAPIService } from "../../Core/Https/transfer-api.service";
import { MessageService } from "../../Core/Services/message.service";
import { TransferListDTO, TransferListRequestDTO } from "../../Core/Models/transferDTO";
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  req!: TransferListRequestDTO;
  transfers: TransferListDTO[] = [];

  constructor(public api: TransferAPIService,
    public session: SessionService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.getTransfers();
  }

  getTransfers(): void {
    this.setRea();
    this.api.getTransfers(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.transfers = res.data;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  setRea(): void {
    this.req = {
      paginate: false,
      perPage: 10,
      search: null,
      type: 1
    }
  }

  deleteTransfer(id: number) {
    this.api.delete(id).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getTransfers()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  checkItemPermission(item: string) {
    return !!this.session.userPermissions.find(x => x.name === item)
  }

}
