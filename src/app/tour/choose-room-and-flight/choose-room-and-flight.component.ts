import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { RateDTO } from 'src/app/Core/Models/newPostDTO';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';

@Component({
  selector: 'prs-choose-room-and-flight',
  templateUrl: './choose-room-and-flight.component.html',
  styleUrls: ['./choose-room-and-flight.component.scss']
})
export class ChooseRoomAndFlightComponent implements OnInit {
  isMobile = false;
  isDesktop = false;
  isTablet = false;

  slug = '';

  req: TourSearchReqDTO = {
    origin: 0,
    date: '',
    destination: 0,
    stayCount: 0
  }
  
  flights: transferRateListDTO[] = [];
  hotelInfo: HotelSearchResDTO = {
    id: 0,
    title: '',
    slug: '',
    flights: [],
    location: '',
    address: '',
    rooms: [],
    stars: 0,
    gallery: [],
    thumbnail: {path: '',url:'',},
    services: []
  }

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
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()
    this.isTablet = mobileService.isTablet()
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? ''
    this.getHotelInfo();
  }

  setReq() {
    this.route.queryParams.subscribe(params => {
      this.req = {
        origin: params['origin'],
        date: moment(params['stDate'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        destination: params['dest'],
        stayCount: params['night'] ?? 1
      }
    }
    );
  }

  getSearchData(): void {
    this.setReq();
    this.api.search('flights', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.flights = res.data;
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


  getPrice(price: number, rates: RateDTO[]): number {
    let roomPrices = 0;
    rates.forEach(x => {
      roomPrices += x.price;
    })
    return roomPrices + price;
  }

  getHotelInfo(): void {
    this.setReq();
    this.api.searchHotelInfo('hotels', this.slug, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.hotelInfo = res.data;
        this.getSearchData()

        // this.paginate = res.meta;
        // this.paginateConfig = {
        //   itemsPerPage: this.paginate.per_page,
        //   totalItems: this.paginate.total,
        //   currentPage: this.paginate.current_page
        // }

      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }

}
