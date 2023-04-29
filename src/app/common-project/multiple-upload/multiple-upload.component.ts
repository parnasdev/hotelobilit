import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'prs-multiple-upload',
  templateUrl: './multiple-upload.component.html',
  styleUrls: ['./multiple-upload.component.scss']
})
export class MultipleUploadComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable?: ElementRef;

  @Input() title: string = 'آپلود تصویر';
  @Input() incommingFiles: UploadResDTO[] = []
  selectedFiles: UploadResDTO[] = []
  @Output() result = new EventEmitter();

public show = true;

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
    if (changes.incommingFiles) {
      this.selectedFiles = [];
      this.incommingFiles.forEach(item => {
        this.selectedFiles.push(item)
      })

      // this.reload()
      

    }
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
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
              this.selectedFiles.push(event.body.data);
              if (this.myInputVariable) {
                this.myInputVariable.nativeElement.value = '';
              }
              this.result.emit(this.selectedFiles)
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
