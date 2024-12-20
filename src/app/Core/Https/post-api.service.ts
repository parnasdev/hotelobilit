import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PublicService } from '../Services/public.service';
import { Result } from '../Models/result';
import { HotelRatesSetReqDTO, HotelSetRequestDTO } from '../Models/hotelDTO';
import { hotelPageDTO, ratigListReqDTO, storeHotelReqDTO, storeHotelSetReqDTO } from '../Models/newPostDTO';

@Injectable({
  providedIn: 'root'
})

export class PostApiService {

  private serverControllerName = 'panel/';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
  }

  getPosts(postType: string ,pageNum = 1,q: string = '', city_name: string = ''): any {
    let strUrl
    if(q !== '' || city_name !== '') {
      strUrl = pageNum ? this.serverControllerName +
      `posts?post_type=${postType}&q=${q}&page=${pageNum}&category=${city_name}` :
       this.serverControllerName + `posts?q=${q}&post_type=${postType}`;
    }else {
      strUrl = pageNum ? this.serverControllerName +
      `posts?post_type=${postType}&page=${pageNum}&category=${city_name}` :
       this.serverControllerName + `posts?post_type=${postType}`;
    }


    return this.http.get<Result<storeHotelReqDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createPosts(postType: string): any {
    const strUrl = this.serverControllerName + `posts/create?post_type=${postType}`;
    return this.http.get<Result<hotelPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  storePosts(postType: string, req: storeHotelSetReqDTO): any {
    const strUrl = this.serverControllerName + `posts?post_type=${postType}`;
    return this.http.post<Result<any>>(strUrl, req ,this.publicService.getDefaultHeaders());
  }

  editPosts(postType: string, postId: number): any {
    const strUrl = this.serverControllerName + `posts/${postId}/edit?post_type=${postType}`;
    return this.http.get<Result<hotelPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  updatePosts(postType: string, req: storeHotelSetReqDTO, postId: number): any {
    const strUrl = this.serverControllerName + `posts/${postId}?post_type=${postType}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  deletePosts(postType: string,  postId: number): any {
    const strUrl = this.serverControllerName + `posts/${postId}?post_type=${postType}`;
    return this.http.delete<Result<any>>(strUrl,  this.publicService.getDefaultHeaders());
  }

  ratingList(req: ratigListReqDTO): any {
    const strUrl = this.serverControllerName + `rates/${req.hotelId}/${req.roomId}?fromDate=${req.fromDate}&toDate=${req.toDate}&agency_id=${req.agency_id}&boardType=${req.boardType}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getAgencyCurrencies(hotelId: any,agency:any): any {
    const strUrl = this.serverControllerName + `currencies/${hotelId}?agency_id=${agency}`;
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  rating(roomId: number, req: HotelRatesSetReqDTO): any {
    const strUrl = this.serverControllerName + `rates/${roomId}`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }
  changeCurrency( req: any): any {
    const strUrl = this.serverControllerName + `currencies`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
