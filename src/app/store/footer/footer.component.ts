import {Component} from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";

@Component({
  selector: 'prs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
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
}
