import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../Services/public.service";
import { Result } from "../Models/result";
import { ChangePasswordReqDTO, LoginReqDTO, RegisterReqDTO, RegisterResDTO, SendCodeReqDTO, UserMeResDTO, ValidationResDTO} from '../Models/AuthDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private serverControllerName = 'auth/';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  me(): any {
    const url = this.serverControllerName + `me`;
    return this.http.get<Result<UserMeResDTO>>(
      url,
      this.publicService.getDefaultHeaders());
  }

  login(req: LoginReqDTO): any {
    const url = this.serverControllerName + `login`;
    return this.http.post<Result<any>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  register(req: RegisterReqDTO): any {
    const url = this.serverControllerName + `register`;
    return this.http.post<Result<RegisterResDTO>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  validate(username: string): any {
    const url = this.serverControllerName + 'validation';
    const entity = {
      username
    };
    return this.http.post<Result<ValidationResDTO>>(
      url,
      entity,
      this.publicService.getDefaultHeaders());
  }

  logout(): any {
    const url = this.serverControllerName + 'logout';
    return this.http.post<Result<string>>(
      url,
      this.publicService.getDefaultHeaders());
  }

  sendSms(req: SendCodeReqDTO): any {
    // forget || tempPassword || register
    const url = this.serverControllerName + 'sendcode';
    return this.http.post<Result<any>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  changePassword(req: ChangePasswordReqDTO): any {
    const url = this.serverControllerName + 'changePassword';
    return this.http.post<Result<any>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }


}
