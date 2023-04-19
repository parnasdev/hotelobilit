import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root'
})
export class CheckErrorService {

    constructor(public router: Router,
        public message: MessageService,
        public session: SessionService) { }


    check(errorCode: any): void {
        switch (errorCode.status) {
            case 403: {
                this.message.custom(errorCode.error.message);

                // this.message.custom('شما دسترسی ندارید');
                break;
            }
            case 401: {
                // this.session.removeUser();
                // this.router.navigateByUrl('/prs-admin');
                break;
            }
            case 422: {
                this.message.custom('اطلاعات ارسالی را مجددا بررسی کنید');
                break;
            }
            case 500: {
                // this.message.custom(errorCode.error.message);
                this.message.custom('مشکلی در سرور رخ داده است');

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

