import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { ActivatedRoute, Router } from '@angular/router';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { MessageService } from 'src/app/Core/Services/message.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { SearchObjectDTO } from 'src/app/Core/Models/newCityDTO';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import * as moment from 'jalali-moment';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';

@Component({
  selector: 'prs-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  isLoading = false;
  isSearch = true
  isFiltering = false;
  req: TourSearchReqDTO = {
    date: '',
    destination: '',
    origin: '',
    stayCount: 0,
    keywords: '',
    stars: 0,
    orderBy: 0,
  }

  routeDataParam: SearchObjectDTO = {
    dest: '',
    night: 0,
    origin: '',
    stDate: ''
  }
  paginate: any;
  paginateConfig: any;

  //filter
  hotels: HotelSearchResDTO[] = [];
  keyword: string = ''
  star = 0;
  expensive: boolean = false
  cheapest: boolean = true;
  orderBy = 1


  constructor(
    public api: TourApiService,
    public cityApi: CityApiService,
    public mobileService: ResponsiveService,
    public calendar: CalenderServices,
    public router: Router,
    public route: ActivatedRoute,
    public message: MessageService,
  ) {
    this.isMobile = mobileService.isMobile();
    this.isDesktop = mobileService.isDesktop();
    this.isTablet = mobileService.isTablet();
    this.route.queryParams.subscribe((params: any) => {
      this.routeDataParam = params;
    })
    if(this.isMobile) {
      this.isSearch = false;
    }
    this.orderBy = this.expensive ? 2 : 1
  }

  ngOnInit() {
    this.getSearchData();

    // window.scroll({
    //   top: 500
    // })
  }

  setReq() {

    this.req = {
      date: moment(this.routeDataParam['stDate'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
      destination: this.routeDataParam['dest'],
      origin: this.routeDataParam['origin'],
      stayCount: this.routeDataParam['night'] ?? 1,
      keywords: this.keyword ? this.keyword : null,
      stars: this.star > 0 ? +this.star : null,
      orderBy: this.orderBy
    }

  }

  getSearchData(): void {
    this.setReq();
    this.isLoading = true
    this.api.search('hotels', this.req).subscribe((res: any) => {
      this.isLoading = false

      if (res.isDone) {
        this.hotels = res.data;
        this.paginate = res.meta;
        if(this.paginate) {
          this.paginateConfig = {
            itemsPerPage: this.paginate.per_page,
            totalItems: this.paginate.total,
            currentPage: this.paginate.current_page
          }
        }

      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }


  search(result: any) {
    this.routeDataParam = result
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: result
    })
    this.getSearchData();

  }

  selectHotel(hotel_slug: string) {
    let city = this.routeDataParam.origin + '-' + this.routeDataParam.dest

    this.router.navigate([`/tour/` + city + '/flight/' + hotel_slug], {
      queryParams: this.routeDataParam
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
    this.filterSubmit()
  }

  filterSubmit() {
    this.getSearchData();
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }

  getMinPrice(hotel: HotelSearchResDTO) {

    let price = 0
    hotel.rooms.forEach(item => {
      if (item.room_type === 'دو تخته' || item.room_type === 'دوتخته') {

        item.rates.forEach((element: any) => {
          price += element.price
        });
      }
    });
    let flightPrice = this.getFlightPrice(hotel.flights)
    if (price === 0) {
      return 0
    } else {
      price = price + flightPrice;
      return price
    }
  }


  getFlightPrice(flights: transferRateListDTO[]) {
    let priceList: number[] = [];
    flights.forEach(item => {
      priceList.push(item.adl_price)
    })
    priceList = priceList.sort((a, b) => a - b)
    return priceList.length > 0 ? priceList[0] : 0;

  }

  removeFilters() {
    this.orderBy = 1;
    this.star = 0;
    this.keyword = ''
    this.filterSubmit()

  }

  filteringOpen() {
    this.isFiltering = !this.isFiltering
  }
  searchBoxOpen() {
    this.isSearch = !this.isSearch
  }
}
