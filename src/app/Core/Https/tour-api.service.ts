import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { TourSearchDTO } from '../Models/newPostDTO';
import { Result } from '../Models/result';

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


  search(req: TourSearchDTO): any {
    const strUrl = this.serverControllerName + 'createHotel';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
}
