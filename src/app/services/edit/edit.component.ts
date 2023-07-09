import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MessageService } from "../../Core/Services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  nameFC = new FormControl();
  images: UploadResDTO[] = [];
  req: any = {
    name: '',
    files: [],
  }
  info: any

  show = false;
  service_id = '';
  serviceType = '';

  constructor(public message: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public dialog: MatDialog,
    public api: CategoryApiService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.service_id = +this.route.snapshot.paramMap.get('id')
    this.route.queryParams.subscribe(params => {
      this.serviceType = params['type'] ?? 'hotel';
      this.getInfo()
    });
  }

  submit(): void {
    this.setReq()
    this.api.updateCategory(+this.service_id, 'tourService', this.serviceType, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/panel/services');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error)

    })
  }

  getImages(result: UploadResDTO[]): void {
    this.images = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? null,
        type: x.type
      }
      this.images.push(obj)
    })
  }


  getInfo(): void {
    this.api.editCategoryPage(+this.service_id, 'tourService', this.serviceType).subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.setValue()
        this.show = true;
      } else {
        this.show = true;
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.show = true;
      this.message.error()
      this.checkError.check(error)

    })
  }

  setValue(): void {
    this.nameFC.setValue(this.info.category.name)
    this.images = this.info.files
  }


  setReq(): void {
    this.req = {
      id: this.service_id,
      name: this.nameFC.value,
      files: this.images
    }
  }
}
