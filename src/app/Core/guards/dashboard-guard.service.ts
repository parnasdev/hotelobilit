import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../Services/message.service';
import { SessionService } from '../Services/session.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuardService {
  role = '';
  constructor(public session: SessionService,
    public message: MessageService,
    public router: Router) {
  }
  canActivate(): any {
    if (this.session.isLoggedIn()) {
      return true;
    } else {
      this.message.custom('شما به این مسیر دسترسی ندارید')
      this.router.navigateByUrl('/');
    }
  }
}
