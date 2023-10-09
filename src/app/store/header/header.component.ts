import { Component } from '@angular/core';
import {ResponsiveService} from "../../Core/Services/responsive.service";
import { SessionService } from 'src/app/Core/Services/session.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { TranslateService } from '@ngx-translate/core';

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
    public messageService: MessageService,
    public checkError: CheckErrorService,
    public translate: TranslateService,
    public api: AuthApiService,
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
  langChanged(value: any) {
    localStorage.setItem('hotelobilit-lang',value)
    this.translate.use(value)
  }

  logout(): void {
    this.isLoading = true
    this.api.logout().subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.removeUser();

      }
    }, (error: any) => {
      this.isLoading = false;
      this.messageService.error();
      this.checkError.check(error);
    })
  }
}
