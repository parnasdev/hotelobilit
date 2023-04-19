import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {Result} from "../Models/result";
import {RoomTypeListDTO, RoomTypeReqDTO, RoomTypeSetDTO} from "../Models/roomTypeDTO";

@Injectable({
  providedIn: 'root'
})
export class RoomTypeApiService {

  private serverControllerName = 'roomtype/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getRoomTypes(req: RoomTypeReqDTO): any {
    const strUrl = this.serverControllerName + 'getRoomTypes';
    return this.http.post<Result<RoomTypeListDTO>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  getCapacityTypes(req: string[]): any {
    const strUrl = this.serverControllerName + 'getTypes';
    return this.http.post<Result<RoomTypeListDTO>>(strUrl, 
      {types: req}, 
      this.publicService.getDefaultHeaders());
  }

  add(req: RoomTypeSetDTO): any {
    const strUrl = this.serverControllerName + `createRoomType`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  edit(req: RoomTypeSetDTO, id: number): any {
    const strUrl = this.serverControllerName + `editRoomType/${id}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  delete(id: number): any {
    const strUrl = this.serverControllerName + `deleteRoomType/${id}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
}
