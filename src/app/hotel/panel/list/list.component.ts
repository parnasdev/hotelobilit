import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelApiService} from "../../../Core/Https/hotel-api.service";
import {MessageService} from "../../../Core/Services/message.service";
import {CommonApiService} from "../../../Core/Https/common-api.service";
import {SessionService} from "../../../Core/Services/session.service";
import {HotelListRes, HotelRequestDTO} from "../../../Core/Models/hotelDTO";
import {FormControl} from "@angular/forms";
import {CityResponseDTO} from "../../../Core/Models/cityDTO";
import {CityApiService} from "../../../Core/Https/city-api.service";
import {AlertDialogComponent, AlertDialogDTO} from "../../../common-project/alert-dialog/alert-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PublicService} from "../../../Core/Services/public.service";

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  cityFC = new FormControl('');
  hotelReq: HotelRequestDTO = {
    isAdmin: true,
    paginate: true,
    city: null,
    search: null
  };
  citiesResponse: CityResponseDTO[] = []
  hotelList: HotelListRes[] = [];
  cityType = false;
  keywordFC = new FormControl('');
  isLoading = false;

  paginateConfig: any;
  paginate: any;
  p = 1;

  constructor(public dialog: MatDialog,
              public hotelApi: HotelApiService,
              public message: MessageService,
              public cityApiService: CityApiService,
              public commonApi: CommonApiService,
              public session: SessionService,
              public publicService: PublicService,
  ) {
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.isLoading = true;
    this.hotelList = [];
    this.hotelReq = {
      isAdmin: true,
      paginate: true,
      city: this.cityFC.value === '' ? null : this.cityFC.value,
      search: this.keywordFC.value
    }
    this.hotelApi.getHotels(this.hotelReq, this.p).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.hotelList = res.data;
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false;
      this.message.error()

    })
  }


  deleteHotel(slug: string) {
    this.hotelApi.delete(slug).subscribe((res: any) => {
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
    this.getList()
  }

  deleteClicked(slug: string) {
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
        this.deleteHotel(slug)
      }
    });
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getList();
  }
}
