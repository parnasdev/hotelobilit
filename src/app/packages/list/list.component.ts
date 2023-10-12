import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { CityListRequestDTO, CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { TourListRequestDTO, TourListResDTO } from 'src/app/Core/Models/tourDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { SettingService } from 'src/app/Core/Services/setting.service';
import { AlertDialogComponent, AlertDialogDTO } from 'src/app/common-project/alert-dialog/alert-dialog.component';
import {Title} from "@angular/platform-browser";

declare let $: any;

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  status = 'All'
  show = true
  tourReq: TourListRequestDTO = {
    origin: null,
    dest: null,
    night: null,
    status: null,
    stDate: null,
    paginate: true,
    sortByDate: false,
    isAdmin: true,
    search: '',
    perPage: 15,
    type: null
  };
  statusNM = ''
  isLoading = false
  stDateFC = new FormControl(null);
  minDate = new Date()
  keyword: string | null = null
  tours: TourListResDTO[] = [];
  paginate: any;
  paginateConfig: any;
  city = '';
  originCities: CityResponseDTO[] = []
  originCityTypeFC = new FormControl(true);
  p = 1;
  sortByDate = false
  printContent = '';
  originFC = new FormControl(null);
  destFC = new FormControl(null);
statuses:any[] = []
  constructor(
    public title: Title,
    public tourApiService: TourApiService,
    public setting: SettingService,
    public cityApi: CityApiService,
    public session: SessionService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public errorService: ErrorsService,
    public publicService: PublicService,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.title.setTitle('تورها | هتل و بلیط')

    $(document).ready(() => {
      $(".item:even").css('background', '#e6e6e6')
      $(".item:odd").css('background', '#f4f7fa')
    })
    this.getTours('first');
    // this.setting.getUserPermission();
  }

  getTours(time: string): void {
    this.isLoading = true;
this.tours = []
    this.tourApiService.getTours( this.p,this.statusNM).subscribe((res: any) => {
      if (res.isDone) {
        this.tours = res.data;

        if(time === 'first'){ 
          this.statuses = res.statuses
        }
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }


  dateChanged() {
    this.getTours('second')
  }

  getOriginCities(): void {
    // const req: CityListRequestDTO = {
    //   type: this.originCityTypeFC.value,
    //   hasHotel: false,
    //   hasDestTour: false,
    //   hasOriginTour: false,
    //   search: null,
    //   perPage: 10
    // }
    // this.cityApi.getCities(req).subscribe((res: any) => {
    //   if (res.isDone) {
    //     this.originCities = res.data;
    //     this.tourReq.origin = this.originCities[0].id.toString();
    //     this.getTours();
    //   }
    // }, (error: any) => {
    //   this.message.error()
    // })
  }

  originCityTypeChange(): void {
    this.getOriginCities()
  }

  statusChanged(): void {

  }


  originSelected(city: any): void {
    this.originFC.setValue(city.slugEn)
    this.getTours('second')
  }
  destSelected(city: any): void {
    this.destFC.setValue(city.slugEn)
    this.getTours('second')

  }


  removeFilter(type: string) {
    if (type === 'origin') {
      this.originFC.setValue(null)
    } else if (type === 'dest') {
      this.destFC.setValue(null)
    } else if (type === 'stDate') {
      this.stDateFC.setValue(null)
    } else {
      this.keyword = null
    }
    this.reload()
    this.getTours('second')
  }



  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }

  deleteTour(id: number): void {
    this.isLoading = true;
    this.tourApiService.deleteTour(id).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom('تور مورد نظر حذف شد');
        this.getTours('second');
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }



  getStatus(statusEn: string): string {
    switch (statusEn) {
      case 'Show':
        return 'نمایش'
      case 'Draft':
        return 'پیش نویس'
      case 'Suspended':
        return 'معلق/منقضی شده'
      case 'Pending':
        return 'در انتظار'
      default:
        return ''
    }
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getTours('second');
  }

  deleteClicked(id:number) {
    const obj: AlertDialogDTO = {
      description: 'حذف شود؟',
      icon: 'null',
      title: 'اطمینان دارید'
    };
    const dialog = this.dialog.open(AlertDialogComponent, {
      width: '30%',
      data: obj
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTour(id)
      }
    });
  }

  // openLogs(id: any): void {
  //   const dialog = this.dialog.open(LogsComponent, {
  //     width: '30%',
  //     data: { id: id, type: 'tour' }
  //   });
  //   dialog.afterClosed().subscribe(result => {
  //   });
  // }


  getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }

  print() {
    let popupWin;
    // @ts-ignore
    // contents = document.getElementById('output').innerHTML;
    // const stylesHtml = this.getTagsHtml('style');
    // const linksHtml = this.getTagsHtml('link');
    // const scriptsHtml = this.getTagsHtml('script');
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // @ts-ignore
    popupWin.document.open();
    // @ts-ignore
    popupWin.document.write(this.printContent);
    // @ts-ignore
    popupWin.document.close();
  }

  exportTour(id: number) {
    this.isLoading = true;
    this.tourApiService.exportTour(id).subscribe((res: any) => {
      if (res.isDone) {
        this.printContent = res.data
        this.print();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

}
