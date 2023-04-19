import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {Result} from "../Models/result";
import { ChangePasswordReqDTO, ConvertRequestDTO, LoginReqDTO, ProfileDTO, UserDTO, ValidateResDTO } from '../Models/AuthDTO';

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

  login(req: LoginReqDTO): any {
    const url = this.serverControllerName + `login`;
    return this.http.post<Result<UserDTO>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  register(req: LoginReqDTO): any {
    const url = this.serverControllerName + `register`;
    return this.http.post<Result<any>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  validate(phone: string): any {
    const url = this.serverControllerName + 'validation';
    const entity = {
      phone
    };
    return this.http.post<Result<ValidateResDTO>>(
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

  sendSms(phone: string, tokenType: string): any {
    const url = this.serverControllerName + 'sendSMS';
    const entity = {
      phone,
      tokenType
    };
    return this.http.post<Result<ValidateResDTO>>(
      url,
      entity,
      this.publicService.getDefaultHeaders());
  }

  changePassword(req: ChangePasswordReqDTO): any {
    const url = this.serverControllerName + 'changePassword';
    return this.http.post<Result<ValidateResDTO>>(
      url,
      req,
      this.publicService.getDefaultHeaders());
  }

  checkUser(): any {
    const url = this.serverControllerName + 'checkUser';
    return this.http.post<Result<ProfileDTO>>(
      url,
      null,
      this.publicService.getDefaultHeaders());
  }

  convertUserToAgency(convertRequestData: ConvertRequestDTO): any {
    const url = this.serverControllerName + 'convert';
    return this.http.post<Result<UserDTO>>(
      url,
      convertRequestData,
      this.publicService.getDefaultHeaders());
  }

}
