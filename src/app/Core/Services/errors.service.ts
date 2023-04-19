import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorsService {
    errors = {};

    constructor(public message: MessageService,
        public router: Router,
        public session: SessionService) {
        this.errors = {};
    }


    hasError(field: any): any {
        return this.errors.hasOwnProperty(field);
    }

    getError(field: any): any {
        // @ts-ignore
        if (this.errors[field]) {
            // @ts-ignore
            return this.errors[field][0];
        }

    }

    recordError(error: any): any {
        this.errors = error;
    }

    any(): any {
        return Object.keys(this.errors).length > 0;
    }

    clear(field = null): any {
        if (field) {
            // @ts-ignore
            delete this.errors[field];
            return;
        }
        this.errors = {};

    }

    check(errorCode: any): void {
        switch (errorCode.status) {
          case 403 : {
            this.message.custom(errorCode.error.message)
            break;
          }
          case 401: {
            this.session.removeUser();
            this.router.navigateByUrl('/auth/validate');
            break;
          }
          case 422: {
            this.recordError(errorCode.error.data)
            this.message.custom('اطلاعات ارسالی را مجددا بررسی کنید');
            break;
          }
          case 500: {
            this.message.custom(errorCode.error.message);
            break;
          }
          case 0: {
            this.message.custom('اتصال خود را بررسی کنید');
            break;
          }
          case 429: {
            this.message.error();
            break;
          }
          case 400: {
            this.message.custom(errorCode.error.message);
            break;
          }
        }
      }
    
}




