import { Component, OnInit } from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { ActivatedRoute, Router } from '@angular/router';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { MessageService } from 'src/app/Core/Services/message.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CityListReq, CityListRes } from 'src/app/Core/Models/newCityDTO';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';

@Component({
  selector: 'prs-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  isMobile = false;
  isDesktop = false;
  isTablet = false;

  req: TourSearchReqDTO = {
  date: '',
  destination: 0,
  stayCount: 0
  }

  hotels: HotelSearchResDTO[] = [];

  paginate: any;
  paginateConfig: any;

  cities: CityListRes[] = []

  constructor(
    public api: TourApiService,
    public cityApi: CityApiService,
    public mobileService: ResponsiveService,
    public calendar: CalenderServices,
    public router: Router,
    public route: ActivatedRoute,
    public message: MessageService,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()

    this.isTablet = mobileService.isTablet()
  }

  ngOnInit() {
    this.getCities();
  }

  setReq(){
    this.route.queryParams.subscribe(params => {
      this.req = {
        date: this.calendar.convertDateSpecial(params['stDate'], 'en'),
        destination: this.checkCity(params['dest']) ?? 133,
        stayCount:params['night'] ?? 1
      }
    }
  );
  }

  getSearchData(): void {
    this.setReq();
    this.api.search('hotels', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.hotels = res.data;
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
      this.message.error()
    })
  }

  getCities(): void {
    // this.isLoading = true
    const req: CityListReq = {
      hasHotel: 0,
      hasFlight: 0,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      // this.isLoading = false
      if (res.isDone) {
        this.cities = res.data;
        this.getSearchData();
        // this.cities = this.cities.sort(function(x, y) {
        //   return Number(y.type) - Number(x.type);
        // })
        
      }
    }, (error: any) => {
      // this.isLoading = false
      this.message.error()
    })
  }

  checkCity(cityCode: string){
    return this.cities.find(x => x.code === cityCode)?.id
  }

  search(result:any) {
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: this.req
    })
  }

  selectHotel(hotel_id: number){
    this.router.navigate([`/tour/` + 'flight/' + hotel_id], {
      queryParams: this.req
    })
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }

  getMinPrice(rooms: any[]){
    let list: number[] = []
    rooms.forEach(item => {
      let price = 0
      item.rates.forEach((element: any) => { price += element.price });
      list.push(price)
    });
    list.sort((a, b)=> b - a);
    return list[0]
  }

}
