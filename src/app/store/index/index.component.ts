import {Component} from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { HotelListResponseDTO } from 'src/app/Core/Models/hotelDTO';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { Router } from '@angular/router';

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
  cities: CityResponseDTO[] = [
  {
    name: 'تهران',
    id: 0,
    type: 0,
    image: 'assets/img/12123131.png',
    slug: 'تهران-۲',
    slugEn: 'tehran-2',
    faq: [],
    description: '',
    images: [],
    nameEn: '',
  },  {
      name: 'شیراز',
      id: 0,
      type: 0,
      image: 'assets/img/12123131.png',
      slug: 'تهران-۲',
      slugEn: 'tehran-2',
      faq: [],
      description: '',
      images: [],
      nameEn: '',
    },  {
      name: 'اضفهان',
      id: 0,
      type: 0,
      image: 'assets/img/12123131.png',
      slug: 'تهران-۲',
      slugEn: 'tehran-2',
      faq: [],
      description: '',
      images: [],
      nameEn: '',
    },  {
      name: 'تبریز',
      id: 0,
      type: 0,
      image: 'assets/img/12123131.png',
      slug: 'تهران-۲',
      slugEn: 'tehran-2',
      faq: [],
      description: '',
      images: [],
      nameEn: '',
    },  {
      name: 'مشهد',
      id: 0,
      type: 0,
      image: 'assets/img/12123131.png',
      slug: 'تهران-۲',
      slugEn: 'tehran-2',
      faq: [],
      description: '',
      images: [],
      nameEn: '',
    },  {
      name: 'کیش',
      id: 0,
      type: 0,
      image: 'assets/img/12123131.png',
      slug: 'تهران-۲',
      slugEn: 'tehran-2',
      faq: [],
      description: '',
      images: [],
      nameEn: '',
    }
  ];

  constructor(
    public mobileService: ResponsiveService,
    public router: Router,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()

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

  search(result:any) {
    let city = result.origin + '-' + result.dest
    this.router.navigate([`/tour/` + city], {
      queryParams: result
    })
  }
}
