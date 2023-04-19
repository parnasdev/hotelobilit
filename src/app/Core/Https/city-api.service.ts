import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {Result} from "../Models/result";
import { CityListRequestDTO, CityResponseDTO, CitySetRequestDTO} from "../Models/cityDTO";

@Injectable({
  providedIn: 'root'
})
export class CityApiService {
  private serverControllerName = 'city/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }


  getCities(req: CityListRequestDTO): any {
    const strUrl = this.serverControllerName + 'getCities';

    return this.http.post<Result<CityResponseDTO>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  add(req: CitySetRequestDTO): any {
    const strUrl = this.serverControllerName + 'createCity';

    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  edit(req: CitySetRequestDTO, name: string): any {
    const strUrl = this.serverControllerName + `editCity/${name}`;

    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  remove(name: string): any {
    const strUrl = this.serverControllerName + `deleteCity/${name}`;

    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getCity(name: string): any {
    const strUrl = this.serverControllerName + `getCity/${name}`;

    return this.http.get<Result<CityResponseDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

}
