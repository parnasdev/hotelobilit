import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PublicService } from '../Services/public.service';
import { Result } from '../Models/result';
import { HotelSetRequestDTO } from '../Models/hotelDTO';
import { hotelPageDTO, storeHotelReqDTO, storeHotelSetReqDTO } from '../Models/newPostDTO';

@Injectable({
  providedIn: 'root'
})

export class PostApiService {

  private serverControllerName = 'panel/posts';

  constructor(public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
  }

  getPosts(postType: string): any {
    const strUrl = this.serverControllerName + `?post_type=${postType}`;
    return this.http.get<Result<storeHotelReqDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createPosts(postType: string): any {
    const strUrl = this.serverControllerName + `?post_type=${postType}`;
    return this.http.get<Result<hotelPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  storePosts(postType: string, req: storeHotelSetReqDTO): any {
    const strUrl = this.serverControllerName + `?post_type=${postType}`;
    return this.http.post<Result<any>>(strUrl, req ,this.publicService.getDefaultHeaders());
  }

  editPosts(postType: string): any {
    const strUrl = this.serverControllerName + `?post_type=${postType}`;
    return this.http.get<Result<hotelPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  updatePosts(postType: string, req: storeHotelSetReqDTO): any {
    const strUrl = this.serverControllerName + `?post_type=${postType}`;
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
