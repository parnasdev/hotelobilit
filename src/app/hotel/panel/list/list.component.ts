import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../Core/Services/message.service";
import {CommonApiService} from "../../../Core/Https/common-api.service";
import {SessionService} from "../../../Core/Services/session.service";
import { HotelRequestDTO} from "../../../Core/Models/hotelDTO";
import {FormControl} from "@angular/forms";
import {CityResponseDTO} from "../../../Core/Models/cityDTO";
import {CityApiService} from "../../../Core/Https/city-api.service";
import {AlertDialogComponent, AlertDialogDTO} from "../../../common-project/alert-dialog/alert-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PublicService} from "../../../Core/Services/public.service";
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { storeHotelReqDTO } from 'src/app/Core/Models/newPostDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import {Title} from "@angular/platform-browser";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  cityFC = new FormControl('');
  hotelReq: any = {
    isAdmin: true,
    paginate: true,
    category: null,
    search: null
  };
  citiesResponse: CityResponseDTO[] = []
  hotelList: storeHotelReqDTO[] = [];
  cityType = false;
  keywordFC = new FormControl('');
  isLoading = false;
  paginateConfig: any;
  paginate: any;
  p = 1;

  constructor(public dialog: MatDialog,
              public hotelApi: PostApiService,
              public title: Title,
              public message: MessageService,
              public checkError: ErrorsService,
              public translate: TranslateService,
              public permition: PermitionsService,
              public cityApiService: CityApiService,
              public commonApi: CommonApiService,
              public session: SessionService,
              public publicService: PublicService,
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('هتل ها | هتل و بلیط')

    this.getList();
  }

  filter() {
    this.p = 1;
    this.getList()
  }

  getList(): void {
    this.isLoading = true;
    this.hotelList = [];
    this.hotelReq = {
      isAdmin: true,
      paginate: true,
      category: this.cityFC.value,
      search: this.keywordFC.value
    }
    this.hotelApi.getPosts('hotel',this.p,this.keywordFC.value ?? '', this.cityFC.value ?? '').subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.citiesResponse = res.cities
        this.hotelList = res.data;
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }

        console.log(res.data)
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false;
      this.checkError.check(error);
      this.message.error()

    })
  }


  deleteHotel(id: any) {
    this.hotelApi.deletePosts('hotel',id).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getList();
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  getCitySelected(item: any): void {
    if (item) {
      this.cityFC.setValue(item.id);
    }else {
      this.cityFC.setValue('');
    }
    // this.getList()
  }

  deleteClicked(id: any) {
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
      debugger
      if (result) {
        this.deleteHotel(id)
      }
    });
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getList();
  }

}
