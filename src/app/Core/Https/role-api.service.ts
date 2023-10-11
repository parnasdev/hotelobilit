import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../Services/public.service";
import { environment } from "../../../environments/environment";
import { Result } from "../Models/result";
import { UserCreateReq } from "../Models/UserDTO";
import { RoleListReqDTO, RoleListResDTO, RoleStoreReqDTO } from '../Models/newRoleDTO';

@Injectable({
  providedIn: 'root'
})
export class RoleApiService {

  private serverControllerName = 'panel/';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getRoles(req: RoleListReqDTO): any {
    let strUrl;
    strUrl = req.keyword !== '' ? 
    this.serverControllerName + `roles?paginate=${req.paginate}&perpage=${req.perpage}&q=${req.keyword}` :
    this.serverControllerName + `roles?paginate=${req.paginate}&perpage=${10}`
    return this.http.get<Result<RoleListResDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createRoles(): any {
    const strUrl = this.serverControllerName + 'roles/create';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  storeRole(req: RoleStoreReqDTO): any {
    const strUrl = this.serverControllerName + 'roles';
    return this.http.post<Result<any>>(strUrl, req ,this.publicService.getDefaultHeaders());
  }

  editRoles(roleId: number): any {
    const strUrl = this.serverControllerName + `roles/${roleId}/edit`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  updateRole(req: RoleStoreReqDTO, roleId: string): any {
    const strUrl = this.serverControllerName + `roles/${roleId}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  deleteRole(roleId: number): any {
    const strUrl = this.serverControllerName + `roles/${roleId}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

}
