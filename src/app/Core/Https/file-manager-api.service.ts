import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {TransferListRequestDTO} from "../Models/transferDTO";
import {Result} from "../Models/result";

@Injectable({
  providedIn: 'root'
})
export class FileManagerApiService {

  private serverControllerName = 'file-manager/';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName =
      environment.BACK_END_IP + this.serverControllerName;
  }

  getFiles(): any {
    const strUrl = this.serverControllerName + 'getFiles';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  createFolder(name: string, directory: string): any {
    const strUrl = this.serverControllerName + 'createFolder';
    const entity={
      name,
      directory
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }
  deleteFolder(directory: string): any {
    const strUrl = this.serverControllerName + 'deleteFolder';
    const entity={
      directory
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }
  deleteFile(path: string): any {
    const strUrl = this.serverControllerName + 'deleteFile';
    const entity={
      path
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }

  upload(file: any, directory: string): any {
    const url = this.serverControllerName + `upload`;

    // tslint:disable-next-line:typedef
    const formData = new FormData();

    formData.append('attachment', file);
    formData.append('directory', directory);
    file.inProgress = true;

    return this.http.post<Result<any>>(
      url,
      formData, {
        reportProgress: true,
        observe: 'events'
      }
    );
  }
}
