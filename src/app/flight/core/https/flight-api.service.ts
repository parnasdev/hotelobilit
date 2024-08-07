import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from 'src/app/Core/Services/public.service';
import { IFlightCreate, IFlightEditReq, IFlightListReq, IFlightStoreReq, IMixStepOneReq, IMixStepTwoReq, IMixedReq, IUpdateBulk } from '../models/flight.model';
import { Result } from 'src/app/Core/Models/result';

@Injectable({
  providedIn: 'root'
})
export class FlightApiService {

  constructor(public publicService: PublicService,
    public http: HttpClient) { }

  list(qparamas: string) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', qparamas);
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  create() {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/create`);
    return this.http.get<Result<IFlightCreate>>(strUrl, this.publicService.getDefaultHeaders());
  }
  edit(id: number) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/${id}/edit`);
    return this.http.get<Result<IFlightCreate>>(strUrl, this.publicService.getDefaultHeaders());
  }
  update(req: IFlightEditReq, id: number) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/${id}`);
    return this.http.patch<Result<IFlightCreate>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  store(req: IFlightStoreReq) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', ``);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  bulkUpdate(req: IUpdateBulk) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/bulk-update`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  bulkDestroy(req:any) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/bulk-destroy`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  bulkMixedFlightDestroy(req:any) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/mix/bulk-destroy`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  mixStepOne(req: IMixStepOneReq) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/mix/step1`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  mixStepTwo(req: IMixStepTwoReq) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/mix/step2`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  mixed(req: IMixedReq) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/mixed`);
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  createMix() {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/mix/create`);
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  updateMix(id:number,req:any) {
    let strUrl = this.publicService.getApiUrlV2(true, 'flights', `/update-mix/${id}`);
    return this.http.patch<Result<any>>(strUrl,req, this.publicService.getDefaultHeaders());
  }
}
