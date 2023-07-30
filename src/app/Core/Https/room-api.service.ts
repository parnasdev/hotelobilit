import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PublicService } from '../Services/public.service';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Models/result';

@Injectable({
  providedIn: 'root'
})
export class RoomApiService {

  private serverControllerName = 'panel/rooms/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  edit(id:number,req: any): any {
    const strUrl = this.serverControllerName + `${id}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
