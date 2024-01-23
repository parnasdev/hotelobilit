import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirlineListDTO } from 'src/app/Core/Models/newAirlineDTO';
import { TransferListRequestDTO } from 'src/app/Core/Models/transferDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  req!: TransferListRequestDTO;
  cities: AirlineListDTO[] = [];
  p = 1
  paginate: any;
  paginateConfig: any;
  parent = 0
  isLoading = false;

  constructor(public api: CategoryApiService,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public session: SessionService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.parent = +this.route.snapshot.paramMap.get('parent')
    this.getCities();
  }

  getCities(): void {
    this.setReq();
    this.isLoading = true;
    this.api.getCategoryList('city', 'hotel', this.p, this.parent).subscribe((res: any) => {
      this.isLoading = false
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
