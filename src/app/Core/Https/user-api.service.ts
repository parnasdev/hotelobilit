import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../Services/public.service";
import { environment } from "../../../environments/environment";
import { Result } from "../Models/result";
import { UserCreateReq } from "../Models/UserDTO";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private serverControllerName = 'panel/users';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getCreateData(): any {
    const strUrl = this.serverControllerName + '/create';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getUser(role: number | null = null, parent: number | null = null, page: number | null = null, keyword: string): any {
    const strUrl = this.serverControllerName + `?role=${role === 0 ? '' : role }&q=${keyword}&page=${page}&parent=${parent ? parent : '' }`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());

  }

  getEditData(id: number): any {
    const strUrl = this.serverControllerName + `/${id}/edit`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  editUser(req: UserCreateReq, userId: string): any {
    const strUrl = this.serverControllerName + `/${userId}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  deleteUser(userId: number): any {
    const strUrl = this.serverControllerName + `/${userId}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createUser(req: UserCreateReq): any {
    const strUrl = this.serverControllerName;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
