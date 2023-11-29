import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';

import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { ITourListReq, ITourListRes } from '../core/models/tour.model';
import { TourApiService } from '../core/https/tour-api.service';




@Component({
  selector: 'prs-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  keyword = ''
  req: ITourListReq = {
    date: '',
    destination: '',
    origin: '',
    stayCount: 1,
    keywords: '',
    stars: ''
  }
  orderBy = 1
  isSearch = true
  isFiltering = false;
  isLoading = false;
  showData = false
  star = 0;

  data: ITourListRes[] = []
  expensive: boolean = false
  cheapest: boolean = true;
  constructor(
    public publicService: PublicService,
    public api: TourApiService,
    public cityApi: CityApiService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.req = {
        date: params['stDate'],
        destination: params['dest'],
        origin: params['origin'],
        stayCount: params['night'],
      }
    })
    this.orderBy = this.expensive ? 2 : 1

  }

  ngOnInit() {
    this.getData()

  }
  getData() {
    this.isLoading = true;
    this.showData = false;
    this.api.getTours(this.req).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.isDone) {
          this.data = res.data
          this.showData = true
        }

      }, error: (error: any) => {
        this.isLoading = false;
        this.publicService.error.check(error);
      }
    })
  }

  selectHotel(hotel_slug: string) {
    let city = this.req.origin + '-' + this.req.destination

    this.router.navigate([`/tour/` + city + '/flight/' + hotel_slug], {
      queryParams: this.req
    })
  }

  orderClicked(name: string, event: any) {
    if (name === 'cheapest') {
      if (event.target.checked) {
        this.orderBy = 1
      }
    } else {
      if (event.target.checked) {
        this.orderBy = 2
      }
    }
    this.getData()
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }
  filteringOpen() {
    this.isFiltering = !this.isFiltering
  }
  searchBoxOpen() {
    this.isSearch = !this.isSearch
  }

  removeFilters() {
    this.orderBy = 1;
    this.star = 0;
    this.keyword = ''
    this.getData()

  }

}
