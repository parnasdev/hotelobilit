import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {CategoryReqDTO} from "../Models/CategoryDTO";
import {Result} from "../Models/result";

export interface RedirectorDTO {
  oldUrl: string
  newUrl: string
}

export interface RedirectorListResDTO {
  created_at: string
  id: number
  newUrl: string
  oldUrl: string
  updated_at: string
}

@Injectable({
  providedIn: 'root'
})
export class RedirectorApiService {

  private serverControllerName = 'redirector/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  findOldUrl(url: string): any {
    const strUrl = this.serverControllerName + `findOldUrl/${url}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getRedirectors(): any {
    const strUrl = this.serverControllerName + `getRedirectors`;
    const entity = {
      perPage: 20,
      paginate: true
    }
    return this.http.post<Result<any>>(strUrl, entity, this.publicService.getDefaultHeaders());
  }

  editRedirector(req: RedirectorDTO, id: number): any {
    const strUrl = this.serverControllerName + `editRedirector/${id}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  createRedirector(req: RedirectorDTO): any {
    const strUrl = this.serverControllerName + `createRedirector`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  deleteRedirector(url: string): any {
    const strUrl = this.serverControllerName + `deleteRedirector/${url}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
}
