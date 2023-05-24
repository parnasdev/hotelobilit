import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { Result } from '../Models/result';
import { serviceSetReq } from '../Models/newServicesDTO';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService {

  private serverControllerName = 'panel/';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
      this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
     }
  
    getServiceList(hotel_id: number): any {
      const strUrl = this.serverControllerName + `services?hotel=${hotel_id}`;
      return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
    }
  
    createServicePage(hotel_id: number): any {
      const strUrl = this.serverControllerName + `services/create?hotel=${hotel_id}`;
      return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
    }
  
    storeService(req: serviceSetReq[]): any {
      const strUrl = this.serverControllerName + `services`;
      return this.http.post<Result<any[]>>(strUrl,req, this.publicService.getDefaultHeaders());
    }
  
    editServicePage(hotel_id: number): any {
      const strUrl = this.serverControllerName + `services/${hotel_id}/edit`;
      return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
    }
  
    updateService(hotel_id: number, req: any): any {
      const strUrl = this.serverControllerName + `services/${hotel_id}`;
      return this.http.patch<Result<any[]>>(strUrl, req, this.publicService.getDefaultHeaders());
    }
  
    // deleteService(cat_id: number,cat_type: string): any {
    //   const strUrl = this.serverControllerName + `services`;
    //   return this.http.delete<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
    // }
}
