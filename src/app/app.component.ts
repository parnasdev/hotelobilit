import { Component, OnInit } from '@angular/core';
import { AuthApiService } from './Core/Https/auth-api.service';
import { UserApiService } from './Core/Https/user-api.service';
import { SessionService } from './Core/Services/session.service';
import { MessageService } from './Core/Services/message.service';
import { CheckErrorService } from './Core/Services/check-error.service';

@Component({
  selector: 'prs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public session: SessionService,
    public userApi: UserApiService,
    public api: AuthApiService,
    public messageService: MessageService,
    public checkError: CheckErrorService) {
  }
  title = 'hotelobilit';

  ngOnInit(): void {
    this.getUserData()
  }

  onActivate(event:any) {
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
          // this.session.getUserPermission();
        } else {
          this.messageService.custom(res.message);
        }
      }, (error: any) => {
      });
    }
  }
}
