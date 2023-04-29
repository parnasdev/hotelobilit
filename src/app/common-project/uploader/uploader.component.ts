import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {PublicService} from "../../Core/Services/public.service";
import {SessionService} from "../../Core/Services/session.service";
import {MessageService} from "../../Core/Services/message.service";
import {FileManagerApiService} from "../../Core/Https/file-manager-api.service";

@Component({
    selector: 'lib-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})

export class UploaderComponent implements OnInit {
    imageSrc: any = null;
    isUpload = false;
    constructor(public publicService: PublicService,
                public dialogRef: MatDialogRef<UploaderComponent>,
                public session: SessionService,
                public message: MessageService,
                public api: FileManagerApiService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }


    ngOnInit(): void {
        this.imageSrc = null;
        if (this.data) {
            this.upload();
        }
    }


    submit(): void {
        this.dialogRef.close(true);
    }

    close(): void {
        this.dialogRef.close();
    }

    deleteAttachment(index: any): void {
        // this.imageSub.unsubscribe();
    }


    PreviewImg(): void {
        if (this.data) {
            const reader = new FileReader();
            reader.readAsDataURL(this.data.file);
            reader.onload = e => {
                this.imageSrc = reader.result;
            };
        }
    }

    upload(): void {
         this.api.upload(this.data.file,'amin').pipe(
            map((event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.data.file.progress = Math.round(event.loaded * 100 / event.total);
                } else if (event.type === HttpEventType.Response) {
                    return event;
                }

            }),
            catchError((error: HttpErrorResponse) => {
                this.data.file.inProgress = false;
                this.message.custom('مشکلی در آپلود رخ داده است');
                this.data.file.progress = 0;
                this.isUpload = false;
                return of(`${this.data.file.name} upload failed.`);
            })).subscribe((event: HttpResponse<any>) => {

            if (event === undefined) {
            } else {
                this.message.custom('با موفقیت آپلود شد');
                this.PreviewImg();
                this.isUpload = true;
            }
        }, (error: any) => {
            this.data.file.progress = 0;
            this.isUpload = false;
            this.message.custom('مشکلی در آپلود رخ داده است');
        });
    }
}
