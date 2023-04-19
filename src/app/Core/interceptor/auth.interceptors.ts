import {HTTP_INTERCEPTORS, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {SessionService} from '../Services/session.service';
import {environment} from "../../../environments/environment";

const TOKEN_HEADER_KEY = 'Authorization';
const GUEST_HEADER_KEY = 'guest-key';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    if (req.url.startsWith(environment.BACK_END_IP) || req.url.startsWith(environment.BACK_END_UPLOAD)) {
      let token = this.session.getToken();

      let headers = new HttpHeaders();
      token = 'Bearer ' + token;
      headers = new HttpHeaders(
        {
          'AppKey': 'AdVNS4mEeLSyIHy640hNHVDsrAOvKmsJ',
          Authorization: token
        });
      let authReq = req.clone({headers});
      return next.handle(authReq);
    } else {
      return next.handle(req);

    }
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
