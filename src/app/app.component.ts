import { Component, OnInit } from '@angular/core';
import { AuthApiService } from './Core/Https/auth-api.service';
import { UserApiService } from './Core/Https/user-api.service';
import { SessionService } from './Core/Services/session.service';
import { MessageService } from './Core/Services/message.service';
import { CheckErrorService } from './Core/Services/check-error.service';
import { PermitionsService } from './Core/Services/permitions.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'prs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public session: SessionService,
    public userApi: UserApiService,
    public pemitionService: PermitionsService,
    public api: AuthApiService,
    public router: Router,
    public translate: TranslateService,
    public messageService: MessageService,
    public checkError: CheckErrorService) {
    translate.addLangs(['fa', 'tr', 'en']);
    let currentLang = localStorage.getItem('hotelobilit-lang')
    this.translate.use(currentLang ?? '')

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use('fa');
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang?.match(/en|tr|fa/) ? browserLang : 'fa');
  }



  title = 'hotelobilit';

  ngOnInit(): void {
    this.getUserData()
  }

  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  getUserData(): void {
    if (this.session.isLoggedIn()) {
      this.api.me().subscribe((res: any) => {
        if (res.isDone) {
          this.session.setUserToSession(res.data);
          this.pemitionService.permissions = res.data.permissions;
          // this.session.getUserPermission();
        } else {
          this.messageService.custom(res.message);
        }
      }, (error: any) => {
        if (error.status === 401) {
          this.session.removeUser();
          this.router.navigateByUrl('/auth');
        }
      });
    }
  }
}
