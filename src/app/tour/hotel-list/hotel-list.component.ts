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

  req: TourSearchReqDTO = {
    date: '',
    destination: 0,
    stayCount: 0
  }

  routeDataParam: SearchObjectDTO = {
    dest: '',
    night: 0,
    origin: '',
    stDate: ''
  }

  hotels: HotelSearchResDTO[] = [];

  paginate: any;
  paginateConfig: any;


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
  }

  ngOnInit() {
    this.getSearchData();
  }

  setReq() {
    this.route.queryParams.subscribe(params => {
      this.req = {
        date: moment(params['stDate'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        destination: params['dest'],
        origin: params['origin'],
        stayCount: params['night'] ?? 1
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



  search(result: any) {
    console.log('search')
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: result
    })
    this.getSearchData();

  }

  selectHotel(hotel_slug: string) {
    console.log(this.routeDataParam);

    let city = this.routeDataParam.origin + '-' + this.routeDataParam.dest

    this.router.navigate([`/tour/` + city + '/flight/' + hotel_slug], {
      queryParams: this.routeDataParam
    })
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }

  getMinPrice(hotel: HotelSearchResDTO) {

    let price = 0
    hotel.rooms.forEach(item => {
      if (item.room_type === 'دو تخته' || item.room_type === 'دوتخته') {

        item.rates.forEach((element: any) => { price += element.price });
      }
    });
    debugger
    let flightPrice = this.getFlightPrice(hotel.flights)
    if(price === 0) {
      return 0
    }else {
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

}
