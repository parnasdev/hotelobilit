import { Component, OnInit } from '@angular/core';
import { TransferAPIService } from "../../Core/Https/transfer-api.service";
import { MessageService } from "../../Core/Services/message.service";
import { TransferListDTO, TransferListRequestDTO } from "../../Core/Models/transferDTO";
import { SessionService } from 'src/app/Core/Services/session.service';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirlineListDTO } from 'src/app/Core/Models/newAirlineDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  req!: TransferListRequestDTO;
  cities: AirlineListDTO[] = [];
  p = 1
  paginate: any;
  paginateConfig: any;
  isLoading = false;

  constructor(public api: CategoryApiService,
    public checkError: CheckErrorService,
    public session: SessionService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.getCities();
  }

  getCities(): void {
    this.setReq();
    this.isLoading = true
    this.api.getCategoryList('city', 'hotel', this.p).subscribe((res: any) => {
      if (res.isDone) {
        this.cities = res.data;
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false
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

  deleteAirport(id: number) {
    this.api.deleteCategory(id, 'city').subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getCities()
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
    this.getCities();
  }

}
