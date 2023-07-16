import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { Result } from '../Models/result';
import { TourSearchReqDTO } from '../Models/newTourDTO';
import { TourListRequestDTO, TourListResDTO, TourSetDTO, TourSetRequestDTO } from '../Models/tourDTO';

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

  generateSlug(title: string): any {
    const strUrl = this.serverControllerName + `generateSlug`;
    const entity = {
      title
    }
    return this.http.post<Result<string>>(strUrl, entity, this.publicService.getDefaultHeaders());
  }


  getFlights(req: any): any {
    const strUrl = environment.BACK_END_IP + 'panel/tours/getflights'
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  gethotels(req: any): any {
    const strUrl = environment.BACK_END_IP + 'panel/tours/gethotels'
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  getHotelsForHome(): any {
    const strUrl = environment.BACK_END_IP + 'tours' + '/available';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  exportTour(id: number): any {
    const strUrl = this.serverControllerName + `export/${id}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  editTour(req: TourSetRequestDTO | TourSetDTO, tour: any): any {
    const strUrl = this.serverControllerName + `editTour/${tour}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  getTours(pageNum?: number): any {
    const address = pageNum ? `panel/tours?page=${pageNum}` : 'panel/tours'
    const strUrl = environment.BACK_END_IP + address;

    return this.http.get<Result<TourListResDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }


  getTour(title: string | null, view: boolean = false): any {
    let strUrl = ''
    if (view) {
      strUrl = this.serverControllerName + `getTour/${title}?view=true`;
    } else {
      strUrl = this.serverControllerName + `getTour/${title}`;
    }
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  deletePackage(package_id: number): any {
    const strUrl = environment.BACK_END_IP + `package/deletePackage/${package_id}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
  createTour(req: any): any {
    const strUrl = environment.BACK_END_IP + 'panel/tours';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  deleteTour(id: number): any {
    const strUrl = environment.BACK_END_IP + `panel/tours/${id}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getTourInfo(id: number): any {
    const strUrl = environment.BACK_END_IP + `panel/tours/${id}/edit`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());

  }
  update(id: number,req: any) {
    const strUrl = environment.BACK_END_IP + `panel/tours/${id}`;
    return this.http.patch<Result<any>>(strUrl,req, this.publicService.getDefaultHeaders());
  }
}
