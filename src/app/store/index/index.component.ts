import {Component, OnInit} from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { HotelListResponseDTO } from 'src/app/Core/Models/hotelDTO';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { MessageService } from 'src/app/Core/Services/message.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';

@Component({
  selector: 'prs-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{
  isLoading = false;
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  isMenu = false;
  hotels: HotelSearchResDTO[] = []
  req: TourSearchReqDTO = {
    date: '',
    destination: '',
    origin: '',
    stayCount: 0,
    keywords: '',
    stars: 0,
    orderBy: 0,
  }
  cities : any[] = []

  constructor(
    public mobileService: ResponsiveService,
    public message:MessageService,
    public api: TourApiService,
    public router: Router,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()

    this.isTablet = mobileService.isTablet()
  }
  ngOnInit(): void {
    // this.getSearchData();
  }

  setReq() {
  
    this.req = {
      date: null,
      destination: null,
      origin: null,
      stayCount: 2,
      keywords: null,
      stars: null,
      orderBy: null
    }

}

  getSearchData(): void {
    this.setReq();
    this.isLoading = true
    this.api.search('hotels', this.req).subscribe((res: any) => {
      this.isLoading = false

      if (res.isDone) {
        this.hotels = res.data;

      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }


  slideNext() {
    // @ts-ignore
    this.swiper.swiperRef.slideNext(200);
  }

  slidePrev() {
    // @ts-ignore
    this.swiper.swiperRef.slidePrev(200);
  }

  getStars(count: string): number[] {
    return Array.from(Array(+count).keys());
  }

  search(result:any) {
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: result
    })
  }
}
