import { Component, OnInit } from '@angular/core';
import { EditComponent } from "../edit/edit.component";

@Component({
  selector: 'prs-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent extends EditComponent implements OnInit {


  override ngOnInit() {
    this.title.setTitle('کپی تور | هتل و بلیط')
    this.id = this.route.snapshot.paramMap.get('id') ?? ''
    this.getPageData()
  }

  override submit(): void {
    this.setReq()
    this.tourApi.createTour(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.errorService.clear();
        this.router.navigateByUrl('/panel/packages');
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })
  }


}
