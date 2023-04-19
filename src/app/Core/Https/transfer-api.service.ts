import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {HotelRequestDTO} from "../Models/hotelDTO";
import {Result} from "../Models/result";
import {TransferListRequestDTO, TransferSetRequestDTO} from "../Models/transferDTO";

@Injectable({
  providedIn: 'root'
})
export class TransferAPIService {

  private serverControllerName = 'transfer/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getTransfers(req: TransferListRequestDTO): any {
    const strUrl = this.serverControllerName + 'getTransfers';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  getTransfer(name: string): any {
    const strUrl = this.serverControllerName + `getTransfer/${name}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  add(req: TransferSetRequestDTO): any {
    const strUrl = this.serverControllerName + `createTransfer`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  edit(req: TransferSetRequestDTO, name: string): any {
    const strUrl = this.serverControllerName + `editTransfer/${name}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  delete(name: any): any {
    const strUrl = this.serverControllerName + `deleteTransfer/${name}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
}

