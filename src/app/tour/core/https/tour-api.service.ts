import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from 'src/app/Core/Models/result';
import { PublicService } from 'src/app/Core/Services/public.service';
import { ITourInfoRes, ITourListReq, ITourListRes } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourApiService {

  constructor(public http: HttpClient, public publicService: PublicService) { }


  getActiveRoute():any {
    let strUrl = this.publicService.getApiUrlV2(false, 'tours', `/active-routes`);
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders())
  }

  getTours(req: ITourListReq) {
    let strUrl = this.publicService.getApiUrlV2(false, 'tours', ``);
    return this.http.post<Result<ITourListRes[]>>(strUrl, req, this.publicService.getDefaultHeaders())
  }

  getTourInfo(req: ITourListReq, hotelSlug: string):any {
    let strUrl = this.publicService.getApiUrlV2(false, 'tours', `/${hotelSlug}`);
    return this.http.post<Result<ITourInfoRes>>(strUrl, req, this.publicService.getDefaultHeaders())
  }
}
