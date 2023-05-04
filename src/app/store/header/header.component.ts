import { Component } from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoading = false;
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  isMenu = false;
  constructor(
    public mobileService: ResponsiveService,
    public session: SessionService
  ) {
    this.isMobile = mobileService.isMobile()
    this.isTablet = mobileService.isTablet()
  }

  menuOpen() {
    this.isMenu = true
  }

  menuClose() {
    this.isMenu = false
  }
}
