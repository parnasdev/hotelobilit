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


  create(req: ReserveCreateDTO): any {
    const strUrl = this.serverControllerName
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  showReserve(reference: string): any {
    const strUrl = this.serverControllerName + '/' + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  voucher(reference: string): any {
    const strUrl = this.serverControllerName + '/voucher' + reference
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  checking(req: ReserveCheckingReqDTO): any {
    const strUrl = this.serverControllerName + '/checking'
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  list(page: number): any {
    const strUrl = environment.BACK_END_IP + 'panel/reserves'
    let publicURL = page ? strUrl + `?page=${page}` : strUrl
    return this.http.get<Result<any>>(publicURL, this.publicService.getDefaultHeaders());
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
    return this.http.patch<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }
}