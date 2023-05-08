import { Component } from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";

@Component({
  selector: 'prs-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent {
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  constructor(
    public mobileService: ResponsiveService,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()

    this.isTablet = mobileService.isTablet()
  }
}
