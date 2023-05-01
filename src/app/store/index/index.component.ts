import {Component} from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";

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
}
