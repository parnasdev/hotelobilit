import { Component} from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import {  TransferListRequestDTO } from "../../Core/Models/transferDTO";
import { SessionService } from 'src/app/Core/Services/session.service';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  req!: TransferListRequestDTO;
  services: any[] = [];
  p = 1
  paginate: any;
  paginateConfig: any;
  isLoading = false

  serviceType = 'hotel';

  constructor(public api: CategoryApiService,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public session: SessionService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.serviceType = params['type'] ?? 'hotel';
      this.getServices();
    });
  }

  getServices(): void {
    this.setRea();
    this.isLoading = true
    this.api.getCategoryList('tourService', this.serviceType, this.p).subscribe((res: any) => {
      if (res.isDone) {
        this.services = res.data;
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

  setRea(): void {
    this.req = {
      paginate: false,
      perPage: 10,
      search: null,
      type: 1
    }
  }

  deleteService(id: number) {
    this.api.deleteCategory(id, 'tourService').subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getServices()
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
    this.getServices();
  }

}
