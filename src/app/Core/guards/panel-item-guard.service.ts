import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from '../Services/message.service';
import { SessionService } from '../Services/session.service';

@Injectable({
  providedIn: 'root'
})
export class PanelItemGuardService {
  role = '';
  constructor(public session: SessionService,
    public message: MessageService,
    public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): any {
    // let permition = route.data?['permition']
    // if (this.checkPermission(permition[0])) {
    //   return true;
    // } else {
    //   this.message.custom('شما به این مسیر دسترسی ندارید')
    //   this.router.navigateByUrl('/panel');

    //   return false
    // }
    return true
  }

  checkPermission(item: string) {
    return !!this.session.userPermissions.find(x => x.name.split('.')[0] === item)
  }
}
