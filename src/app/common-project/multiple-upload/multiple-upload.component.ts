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
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { FileManagerApiService } from 'src/app/Core/Https/file-manager-api.service';
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
  @Output() deletedImages = new EventEmitter();


  public show = true;
  removedImages: number[] = [];
  isLoading = false;
  fileProgress = 0;
  isUpload = false
  fileLoading = false


  constructor(public uploaderApi: FileManagerApiService,
    public publicService: PublicService,
    public session: SessionService,
    public route: ActivatedRoute,
    public message: MessageService,
    public errorsService: ErrorsService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incommingFiles']) {

      this.selectedFiles = [];
      this.incommingFiles.forEach(item => {
        this.selectedFiles.push(item)
      })
      if (!this.checkExistsThumbnail()) {
        if(this.selectedFiles.length > 0) {
          this.selectedFiles[0].type = 1;
        }

      }
      // this.reload()
    }
  }


  setThumbnail(index: number) {
    this.selectedFiles.forEach(x => x.type = 2)
    this.selectedFiles[index].type = 1
    this.result.emit(this.selectedFiles)
    this.reload()
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }


  remove(index: number) {
    let imageID: number = (this.selectedFiles[index].id ?? 0)
    if (imageID > 0) {
      this.removedImages.push(imageID)

    }

    this.selectedFiles.splice(index, 1)
    this.deletedImages.emit(this.removedImages)
    this.result.emit(this.selectedFiles)
  }


  checkExistsThumbnail(): boolean {
    let result: UploadResDTO[] = this.selectedFiles.filter(x => x.type === 1)
    return result.length > 0
  }


  ngOnInit(): void {

  }
  getFile(files: any): void {
    for (const event of files.target.files) {
      const size = event.size / 1000 / 1000;

      if (size < 2) {
        this.uploaderApi.upload(event, '/').pipe(
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
              let obj: UploadResDTO = {
                path: event.body.data.path ?? '',
                url: event.body.data.url ?? '',
                alt: event.body.data.alt ?? '',
                id: event.body.data.id ?? null,
                type: event.body.data.type ?? 2
              }
              this.selectedFiles.push(obj);

              if (!this.checkExistsThumbnail()) {
                this.selectedFiles[0].type = 1;
              }
              if (this.myInputVariable) {
                this.myInputVariable.nativeElement.value = '';
              }
              this.reload();
              this.result.emit(this.selectedFiles)
              this.isUpload = true;
            }
          }, (error: any) => {
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
