import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PublicService} from "../Services/public.service";
import {environment} from "../../../environments/environment";
import {TransferListRequestDTO} from "../Models/transferDTO";
import {Result} from "../Models/result";
import { fileListResDTO } from '../Models/uploaderDTO';

@Injectable({
  providedIn: 'root'
})
export class FileManagerApiService {

  private serverControllerName = 'panel/uploader';

  constructor(public http: HttpClient,
              public publicService: PublicService) {
    this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
  }

  getFiles(): any {
    const strUrl = this.serverControllerName;
    return this.http.get<Result<fileListResDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  upload(file: any, directory: string): any {
    const url = this.serverControllerName;
    // tslint:disable-next-line:typedef
    const formData = new FormData();
    formData.append('data', file);
    formData.append('path', directory);
    file.inProgress = true;
    return this.http.post<Result<any>>(url,formData, {reportProgress: true,observe: 'events'}
    );
  }

  createFolder(name: string, directory: string): any {
    const strUrl = this.serverControllerName + '/createFolder';
    return this.http.post<Result<any>>(strUrl,null, this.publicService.getDefaultHeaders());
  }

  renameFolder(old_path: string, new_path: string): any {
    const strUrl = this.serverControllerName + '/edit';
    const entity={
      'old_path': old_path,
      'new_path': new_path
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }

  moveFile(from_path: string, to_path: string): any {
    const strUrl = this.serverControllerName + '/moving';
    const entity={
      'from_path': from_path,
      'to_path': to_path
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }

  deleteFile(type: string, path: string): any {
    const strUrl = this.serverControllerName + '/destroy';
    const entity={
      'type': type,
      'path': path
    }
    return this.http.post<Result<any>>(strUrl,entity, this.publicService.getDefaultHeaders());
  }

}
