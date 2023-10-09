import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { HotelListResponseDTO } from 'src/app/Core/Models/hotelDTO';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { MessageService } from 'src/app/Core/Services/message.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { SearchObjectDTO } from 'src/app/Core/Models/newCityDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'prs-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
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

  routeDataParam: SearchObjectDTO = {
    dest: '',
    night: 0,
    origin: '',
    stDate: ''
  }
  cities: any[] = []

  constructor(
    public mobileService: ResponsiveService,
    public message: MessageService,
    public api: TourApiService,
    public translate: TranslateService,

    public calendarService: CalenderServices,
    public router: Router,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()

    this.isTablet = mobileService.isTablet()
  }
  ngOnInit(): void {
    this.getSearchData();
  }



  getSearchData(): void {
    this.isLoading = true
    this.api.getHotelsForHome().subscribe((res: any) => {
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

  search(result: any) {
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: result
    })
  }

  getStar(star: string | number): any[] {
    let list = []
    for (let i = 0; i < +star; i++) {
      list.push(i);
    }
    return list
  }
  

  selectHotel(hotel_slug: string ,flight: any) {
    this.routeDataParam = {
      origin: flight.origin_code,
      dest : flight.destination_code,
      night : this.getNight(flight.date,flight.flight.date),
      stDate: this.calendarService.convertDate(flight.date,'fa')
    }
    let city = this.routeDataParam.origin + '-' + this.routeDataParam.dest

    this.router.navigate([`/tour/` + city + '/flight/' + hotel_slug], {
      queryParams: this.routeDataParam
    })
  }

getNight(originDate:string,destinationDate:string) {
let list = this.calendarService.enumerateDaysBetweenDates(originDate,destinationDate);
console.log(list.length) 
return list.length -1
}

}
