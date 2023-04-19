import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {Result} from "../Models/result";
import {TransferListRequestDTO, TransferSetRequestDTO} from "../Models/transferDTO";
import { TransferRateListReqDTO, TransferRateSetReqDTO } from '../Models/transferRateDTO';

@Injectable({
  providedIn: 'root'
})
export class TransferRateAPIService {

  private serverControllerName = 'transferRate/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getTransfers(req: TransferRateListReqDTO): any {
    const strUrl = this.serverControllerName + 'getTransferRates';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  getTransfer(id: number): any {
    const strUrl = this.serverControllerName + `getTransferRate/${id}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  add(req: TransferRateSetReqDTO): any {
    const strUrl = this.serverControllerName + `createTransferRate`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  edit(req: TransferRateSetReqDTO, id: number): any {
    const strUrl = this.serverControllerName + `editTransferRate/${id}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  delete(id: any): any {
    const strUrl = this.serverControllerName + `deleteTransferRate/${id}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
}

