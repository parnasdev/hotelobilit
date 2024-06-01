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

  private serverControllerName = 'reserves';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }


  create(req: ReserveCreateDTO, ref_code: string): any {
    // const strUrl = this.serverControllerName
    const strUrl = 'https://hotelobilit-api.iran.liara.run/api/v2/' + 'reserves/' + ref_code
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  showReserve(reference: string): any {
    const strUrl = 'https://hotelobilit-api.iran.liara.run/api/v2/' + 'reserves' + '/' + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  voucher(reference: string): any {
    const strUrl = this.serverControllerName + '/voucher' + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  checking(req: ReserveCheckingReqDTO): any {
    const strUrl = 'https://hotelobilit-api.iran.liara.run/api/v2/' + 'reserves' + '/checking'
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  list(params:string): any {
    const strUrl = environment.BACK_END_IP + 'panel/reserves'
    let publicURL = strUrl + params
    return this.http.get<Result<any>>(publicURL, this.publicService.getDefaultHeaders());
  }
  delete(id:any): any {
    const strUrl = environment.BACK_END_IP + `panel/reserves/${id}`
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  flightReserveList(page: number, flight: any, status: any): any {
    const strUrl = environment.BACK_END_IP + `panel/reserves?flight=${flight}&status=${status}&page=${page}`
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  getReserve(id: number): any {
    const strUrl = environment.BACK_END_IP + `panel/reserves/${id}/edit`
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  editReserve(id: number, statusId: number): any {
    const strUrl = environment.BACK_END_IP + `panel/reserves/${id}`
    const entity = {
      status: statusId
    }
    return this.http.patch<Result<any>>(strUrl, entity, this.publicService.getDefaultHeaders());
  }
  confirm(ref_code: string) {
    const strUrl = environment.BACK_END_IP_V2 + `reserves/confirm/${ref_code}`
    return this.http.post<Result<any>>(strUrl, this.publicService.getDefaultHeaders());

  }
}
