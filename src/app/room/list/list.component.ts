import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import { TransferListRequestDTO } from "../../Core/Models/transferDTO";
import { SessionService } from 'src/app/Core/Services/session.service';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirlineListDTO } from 'src/app/Core/Models/newAirlineDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { RoomListDTO } from 'src/app/Core/Models/newRoomDTO';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  req!: TransferListRequestDTO;
  rooms: RoomListDTO[] = [];
  p = 1
  paginate: any;
  paginateConfig: any;

  constructor(public api: CategoryApiService,
    public checkError: CheckErrorService,
    public session: SessionService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.getTransfers();
  }

  getTransfers(): void {
    this.setReq();
    this.api.getCategoryList('RoomType', 'hotel', this.p).subscribe((res: any) => {
      if (res.isDone) {
        this.rooms = res.data;
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.checkError.check(error)
      this.message.error()
    })
  }

  setReq(): void {
    this.req = {
      paginate: false,
      perPage: 10,
      search: null,
      type: 1
    }
  }

  deleteRoom(id: number) {
    this.api.deleteCategory(id, 'RoomType').subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getTransfers()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.checkError.check(error)

      this.message.error()
    })
  }

  checkItemPermission(item: string) {
    return !!this.session.userPermissions.find(x => x.name === item)
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getTransfers();
  }
}
