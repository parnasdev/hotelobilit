import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {Result} from "../Models/result";
import {SettingDTO} from "../Models/commonDTO";

@Injectable({
  providedIn: 'root'
})

export class SettingApiService {

  private serverControllerName = 'panel/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getSetting(): any {
    const strUrl = this.serverControllerName + 'setting';
    return this.http.get<Result<SettingDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  changeSetting(settings: any): any {
    const strUrl = this.serverControllerName + 'setting';
    return this.http.patch<Result<any>>(strUrl, { 'options': settings }, this.publicService.getDefaultHeaders());
  }

  getCurrencies(): any {
    const strUrl = this.serverControllerName + 'setting/currencies';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getServices(): any {
    const strUrl = this.serverControllerName + 'setting/services';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }


}
