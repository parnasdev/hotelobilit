import {Component} from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { HotelListResponseDTO } from 'src/app/Core/Models/hotelDTO';

@Component({
  selector: 'prs-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  isLoading = false;
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  isMenu = false;
  hotels: HotelListResponseDTO[] = [ {
    id: 1,
    name: 'هتل تست',
    nameEn: 'hotel test',
    slug: 'hotel-test',
    keyword: '---',
    slugEn: 'hotel-test',
    stars: '',
    thumbnail: 'assets/img/12123131.png',
    city: '',
    location: '',
  }];

  constructor(
    public mobileService: ResponsiveService,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isTablet = mobileService.isTablet()
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

}
