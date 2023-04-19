import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../Services/public.service";
import { environment } from "../../../environments/environment";
import { Result } from "../Models/result";
import { GetServiceRequestDTO } from "../Models/commonDTO";
import { SessionService } from '../Services/session.service';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  private serverControllerName = 'common/';

  constructor(public http: HttpClient,
    public session: SessionService,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getRates(): any {
    const strUrl = this.serverControllerName + 'getRates';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getRoles(): any {
    const strUrl = this.serverControllerName + 'getRoles';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getServices(): any {
    const strUrl = this.serverControllerName + 'getServices';
    return this.http.get<Result<GetServiceRequestDTO[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getTransferTypes(): any {
    const strUrl = this.serverControllerName + 'getTransferTypes';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  singleFileUpload(file: any) {
    const strUrl = environment.BACK_END_UPLOAD + 'upload';
    // tslint:disable-next-line:typedef
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path_name', 'agency');

    return this.http.post<Result<any>>(
      strUrl,
      formData, {
      reportProgress: true,
      observe: 'events'
    },);
  }
}
