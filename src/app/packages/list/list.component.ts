import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import {  CityResponseDTO } from 'src/app/Core/Models/cityDTO';
import { TourListRequestDTO, TourListResDTO } from 'src/app/Core/Models/tourDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { SettingService } from 'src/app/Core/Services/setting.service';
import { AlertDialogComponent, AlertDialogDTO } from 'src/app/common-project/alert-dialog/alert-dialog.component';
import { Title } from "@angular/platform-browser";
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

declare let $: any;

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  status = 'All';
  show = true
  nights = [
    { id: 1, name: '۱ شب' },
    { id: 2, name: '۲ شب' },
    { id: 3, name: '۳ شب' },
    { id: 4, name: '۴ شب' },
    { id: 5, name: '۵ شب' },
    { id: 6, name: '۶ شب' },
    { id: 7, name: '۷ شب' },
    { id: 8, name: '۸ شب' },
    { id: 9, name: '۹ شب' },
  ];
  playAudio(): void {
    const audio = new Audio('/assets/audio/notif.mp3');
    audio.play()
      .then(() => {
        console.log('Audio played successfully');
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
      });
  }


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
  filterObj: any = {
    destination: null,
    origin: null,
    stay_count:'',
    status: 1,
    fromDate: null,
    toDate: null,
    tourId:'',
    isBundle:'',
    agency_id:''
  };
  cities: any[] = []
  isLoading = false
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
  agencies:any[]=[]

  statuses: any[] = []
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
    setTimeout(()=>{this.playAudio()},2000)
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
    let qparams = this.publicService.getFiltersObjectString(this.filterObj)

    this.tourApiService.getTours(this.p, qparams).subscribe((res: any) => {
      if (res.isDone) {
        this.tours = res.data;
this.agencies = res.agencies;
        if (time === 'first') {
          this.statuses = res.statuses
          this.cities = res.cities
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


  edit(tour:any) {
    window.open(`/panel/packages/edit/${tour.id}`)
  }
  copy(tour:any) {
    window.open(`/panel/packages/copy/${tour.id}`)
  }
 removeFilter() {
    this.filterObj = {
      destination: null,
      origin: null,
      status: 0,
      stay_count: '',
      fromDate: null,
      toDate: null,
      isBundle:'',
      tourId:'',
      agency_id:'',

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

  deleteClicked(id: number) {
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
  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.filterObj.fromDate = res.fromDate.dateEn
        this.filterObj.toDate = res.toDate.dateEn;
      }

    })
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
    let popupWin: any;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if (popupWin.location) {
      popupWin.location.href = this.printContent;
    } else {
      this.publicService.message.custom('امکان مشاهده وجود ندارد')
    }
  }

  exportTour(id: number) {
    this.isLoading = true;
    this.tourApiService.exportTour(id).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.printContent = res.data.url
        this.print();
      } else {
        this.message.custom(res.message);
      }

    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

}
