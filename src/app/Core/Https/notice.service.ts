import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {Result} from "../Models/result";

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private serverControllerName = 'notice/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getNotice(): any {
    const strUrl = environment.BACK_END_IP + 'panel/notice'
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }
}
