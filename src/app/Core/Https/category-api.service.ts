import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { Result } from '../Models/result';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  private serverControllerName = 'panel/';

  constructor(
    public http: HttpClient,
    public publicService: PublicService) 
    {
      this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
    }
  
  getCategoryList(cat_type: string, post_type: string, page: number, parent: number|null = null): any {
    // cat_type  = airline airport 
    const strUrl = this.serverControllerName + `categories?cat_type=${cat_type}&post_type=${post_type}&page=${page}&parent=${parent}`;
    return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createCategoryPage(cat_type: string, post_type: string): any {
    const strUrl = this.serverControllerName + `categories/create?cat_type=${cat_type}&post_type=${post_type}`;
    return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  storeCategory(cat_type: string, post_type: string, req: any): any {
    const strUrl = this.serverControllerName + `categories?cat_type=${cat_type}&post_type=${post_type}`;
    return this.http.post<Result<any[]>>(strUrl,req, this.publicService.getDefaultHeaders());
  }

  editCategoryPage(cat_id: number,cat_type: string, post_type: string): any {
    const strUrl = this.serverControllerName + `categories/${cat_id}/edit?cat_type=${cat_type}&post_type=${post_type}`;
    return this.http.get<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  updateCategory(cat_id: number,cat_type: string, post_type: string, req: any): any {
    const strUrl = this.serverControllerName + `categories/${cat_id}?cat_type=${cat_type}&post_type=${post_type}`;
    return this.http.patch<Result<any[]>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  deleteCategory(cat_id: number,cat_type: string): any {
    const strUrl = this.serverControllerName + `categories/${cat_id}?cat_type=${cat_type}`;
    return this.http.delete<Result<any[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

}
