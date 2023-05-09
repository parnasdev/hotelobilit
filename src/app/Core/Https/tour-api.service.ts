import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { TourSearchDTO } from '../Models/newPostDTO';
import { Result } from '../Models/result';
import { TourSearchReqDTO } from '../Models/newTourDTO';

@Injectable({
  providedIn: 'root'
})
export class TourApiService {
  private serverControllerName = 'tour/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  search(type: string, req: TourSearchReqDTO): any {
    const strUrl = environment.BACK_END_IP + type + '/search';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  searchHotelInfo(type: string, hotelSlug: string, req: TourSearchReqDTO): any {
    const strUrl = environment.BACK_END_IP + type + '/search/' + hotelSlug;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
