import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ErrorsService } from "../../Core/Services/errors.service";
import { MessageService } from "../../Core/Services/message.service";
import { CommonApiService } from "../../Core/Https/common-api.service";
import { PublicService } from "../../Core/Services/public.service";
import { SessionService } from "../../Core/Services/session.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadResDTO } from 'src/app/agencies/edit/edit.component';



@Component({
  selector: 'prs-upload-single',
  templateUrl: './upload-single.component.html',
  styleUrls: ['./upload-single.component.scss']
})
export class UploadSingleComponent implements OnInit,OnChanges {
  @Input() title: string = 'آپلود تصویر';
  @Input() incommingFile: UploadResDTO = {
    path: '',
    url: ''
  }
  selectedFile: UploadResDTO | null = {
    path: '',
    url: ''
  };
  @Output() result = new EventEmitter();
  isLoading = false;
  fileProgress = 0;
  isUpload = false
  fileLoading = false
  constructor(public commonApi: CommonApiService,
    public publicService: PublicService,
    public session: SessionService,
    public route: ActivatedRoute,
    public message: MessageService,
    public errorsService: ErrorsService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.incommingFile){
      this.selectedFile= this.incommingFile;
    }
  }


  ngOnInit(): void {

  }
  getFile(files: any): void {
    for (const event of files.target.files) {
      const size = event.size / 1000 / 1000;

      if (size < 2) {
        this.commonApi.singleFileUpload(event).pipe(
          map((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.fileProgress = Math.round(event.loaded * 100 / event.total);
            } else if (event.type === HttpEventType.Response) {
              return event;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this.message.custom('فایل آپلود نشد مجدد تلاش کنید');
            this.fileProgress = 0
            this.isUpload = false;
            return of(`upload failed.`);
          })).subscribe((event: HttpResponse<any>) => {
            this.fileLoading = false

            if (event === undefined) {
            } else {
              this.selectedFile = event.body.data;
              this.result.emit(this.selectedFile)
              this.isUpload = true;
            }
          }, error => {
            this.isUpload = false;
            this.message.custom('فایل آپلود نشد مجدد تلاش کنید');
          });
      }
      else {
        this.message.custom('حجم فایل ارسالی باید کمتر از 2 مگابایت باشد');

      }
    }
  }
}
