import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CommonApiService } from 'src/app/Core/Https/common-api.service';
import { MapApiService } from 'src/app/Core/Https/map-api.service';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { RoomApiService } from 'src/app/Core/Https/room-api.service';
import { RoomTypeApiService } from 'src/app/Core/Https/room-type-api.service';
import { InfoHotelDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-set-rooms-and-coefficient',
  templateUrl: './set-rooms-and-coefficient.component.html',
  styleUrls: ['./set-rooms-and-coefficient.component.scss']
})
export class SetRoomsAndCoefficientComponent implements OnInit {
  @Input() hotel_id: number = 0
  isCoefficient: string = '0';
  rooms: roomDTO[] = []
  isLoading = false;
  removedRoomsIDs: number[] = []
  errors:any = []
  selectedRooms: roomDTO[] = [];

  req: any = {
    del_rooms: [],
    rooms: [],
  }
  hotelInfo: InfoHotelDTO = {
    statuses: [],
    cities: [],

    roomTypes: [],
    post: {
      id: 0,
      user_id: 0,
      location:'',
      address: '',
      titleEn: '',
      title: '',
      slug: '',
      description: '',
      body: '',
      options: {} as any,
      pin: false,
      comment: false,
      post_type: '',
      status_id: 0,
      deleted_at: '',
      created_at: '',
      updated_at: '',
      files: []
    },
    rooms: [],
    files: [],
    services: [],
    service_ids: [],
    city_id: 0,

  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
    public roomApi: RoomApiService,
    public hotelApi: PostApiService,
    public message: MessageService,
    public commonApi: CommonApiService,
    public roomTypeApi: RoomTypeApiService,
    public dialog: MatDialog,
    public session: SessionService,
    public calenderServices: CalenderServices,
    public publicServices: PublicService,
    public mapApi: MapApiService,
    public fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.isLoading = true
    this.hotelApi.editPosts('hotel', this.hotel_id).subscribe((res: any) => {
      if (res.isDone) {
        this.hotelInfo = res.data;
        this.createRooms()
        let obj = this.hotelInfo.rooms.find(x => x.room_type === 'دوتخته' || x.room_type === 'دو تخته')
        if (obj && obj.has_coefficient) {
          this.isCoefficient = '1'
        } else {
          this.isCoefficient = '0'
        }
      } else {
        this.message.custom(res.message)
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false

      this.checkError.check(error);
      this.message.error()
    })
  }

  setHasCoefficients() {
    if (this.isCoefficient === '1') {
      this.selectedRooms.forEach(x => {
        if (x.name === 'دوتخته' ||
          x.name === 'تویین' ||
          x.name === 'twin' ||
          x.name === 'double' ||
          x.name === 'دابل' ||
          x.name === 'دو تخته' ||
          x.name === '2 تخته' ||
          x.name === '۲ تخت') {
          x.has_coefficient = true;
          x.coefficient = 2;
        } else {
          x.has_coefficient = false;
        }
      })
    } else {
      this.selectedRooms.forEach(x => {
        x.has_coefficient = false
      })
    }
  }
  setEditReq(): void {
    this.getSelectedRoomList()
    this.getRemovedRooms()
    this.setHasCoefficients()
    this.req = {
      del_rooms: this.removedRoomsIDs,
      rooms: this.selectedRooms
    }
  }

  createRooms() {
    this.rooms = [];
    this.hotelInfo.roomTypes.forEach((item: any) => {
      let room = this.hotelInfo.rooms.find(x => x.room_type_id === item.id);
      let obj: roomDTO = {
        id: room?.id ?? 0,
        name: room?.name ?? item.name,
        room_type_id: room?.room_type_id ?? item.id,
        extra_bed_count: room?.extra_bed_count ?? item.extra_bed_count,
        is_twin_count: room?.is_twin_count ?? item.is_twin_count,
        online_reservation: room?.online_reservation ?? item.online_reservation,
        coefficient: room?.coefficient ?? item.coefficient,
        isDisable: room?.isDisable ?? false,
        isSelected: room ? true : false,
        has_coefficient: false,
        Adl_capacity: room?.Adl_capacity ?? item.Adl_capacity,
        chd_capacity: room?.chd_capacity ?? item.chd_capacity,
        age_child: room?.age_child ?? item.age_child,
        total_extra_count: room?.total_extra_count ?? item.total_extra
      }
      this.rooms.push(obj)
    })
  }

  edit(): void {
    this.setEditReq();
    this.roomApi.edit(this.hotel_id, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getInfo();
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.errors);
        this.message.custom(error.error.message)
        this.errors = Object.values(error.error.errors)


      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })




  }

  getRemovedRooms() {
    this.hotelInfo.rooms.forEach(sr => {
      let x = this.selectedRooms.find(y => y.id == sr.id);
      if (!x) {
        this.removedRoomsIDs.push(sr.id)
      }
    })
  }

  getSelectedRoomList() {
    this.selectedRooms = [];
    this.rooms.forEach(x => {
      if (x.isSelected) {
        let obj = {
          id: x.id,
          name: x.name,
          room_type_id: x.room_type_id,
          coefficient: x.coefficient,
          is_twin_count: x.is_twin_count,
          extra_bed_count: x.extra_bed_count,
          online_reservation: x.online_reservation,
          isDisable: x.isDisable,
          has_coefficient: x.has_coefficient,
          Adl_capacity: x.Adl_capacity,
          chd_capacity: x.chd_capacity,
          age_child: x.age_child,
          total_extra_count: x.total_extra_count
        }
        this.selectedRooms.push(obj)
      }
    })
  }

  hasError(i: number, name: string) {
    return this.errorService.hasError('rooms.' + i + '.' + name)
  }

  getError(i: number, name: string) {
    return this.errorService.getError('rooms.' + i + '.' + name)
  }
}
