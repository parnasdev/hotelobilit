import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../Services/session.service";
import {Result} from "../Models/result";
import {MapReverseDTO} from "../Models/mapDTO";

@Injectable({
  providedIn: 'root'
})
export class MapApiService {

  constructor(public http: HttpClient,
              public session: SessionService) {
  }

  reverse(lat: any, lng: any, token: string): any {
    this.session.setOutlineApi(true);
    const url = `https://map.ir/reverse`;
    return this.http.get<Result<MapReverseDTO>>(url, {
      params: {lat, lon: lng}, headers: {
        'x-api-key': token,
        Accept: 'application/json'
      }});
  }
}
