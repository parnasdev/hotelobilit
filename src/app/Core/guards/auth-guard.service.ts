import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../Services/message.service';
import { SessionService } from '../Services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  role = '';

  constructor(public session: SessionService,
    public message: MessageService,
    public router: Router) {
  }

  canActivate(): any {
    this.role = this.session.getRole();
    if (!this.session.isLoggedIn()) {
      return true;
    } else {
      this.message.custom('شما ورود کرده اید')
      if (this.session.getRole() === 'admin' || this.session.getRole() === 'Agency' || this.session.getRole() === 'Staff') {
        this.router.navigateByUrl('/panel');
      } else {
        this.router.navigateByUrl('/');

      }
    }
  }
}
