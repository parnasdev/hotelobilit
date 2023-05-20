import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { ReserveCheckingReqDTO, ReserveCreateDTO } from '../Models/reserveDTO';
import { Result } from '../Models/result';

@Injectable({
  providedIn: 'root'
})
export class ReserveApiService {

  private serverControllerName = 'reserves/';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }


  create(req: ReserveCreateDTO): any {
    const strUrl = this.serverControllerName
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  showReserve(reference: string): any {
    const strUrl = this.serverControllerName + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  voucher(reference: string): any {
    const strUrl = this.serverControllerName + 'voucher' + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  checking(req: ReserveCheckingReqDTO): any {
    const strUrl = this.serverControllerName + 'checking'
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
}
