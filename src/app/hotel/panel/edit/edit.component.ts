import { Component, OnInit } from '@angular/core';
import { AddComponent } from "../add/add.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { InfoHotelDTO, roomDTO, roomObjDTO } from 'src/app/Core/Models/newPostDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {
  showData = false
  hotelName = '';
  hotelId = 1;
  roomTypes: roomObjDTO[] = []



  removedRoomsIDs: number[] = []
  hotelInfo: InfoHotelDTO = {
    statuses: [],
    cities: [],

    roomTypes: [],
    post: {
      id: 0,
      user_id: 0,
      address: '',
      location: '',
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

  public override show = true;
  // showServices = false;
  hotelImages: UploadResDTO[] = [];
  removedImages: number[] = [];

  override ngOnInit(): void {
    this.title.setTitle('ویرایش هتل | هتل و بلیط')

    this.errorService.clear();
    // @ts-ignore
    this.hotelId = this.route.snapshot.paramMap.get('id');
    this.getInfo();
  }

  getInfo(): void {
    this.isLoading = true;
    this.hotelApi.editPosts('hotel', this.hotelId).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.hotelInfo = res.data;
        this.roomTypes = this.hotelInfo.roomTypes;
        this.showCities = true;
        this.createRooms()
        this.setData()
        this.showData = true
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false;
      this.checkError.check(error);
      this.message.error()
    })
  }

  compare(c1: { name: string }, c2: { name: string }) {
    return c1 && c2 && c1.name === c2.name;
  }


  createRooms() {
    this.hotelInfo.roomTypes.forEach((item: any) => {
      let room = this.hotelInfo.rooms.find(x => x.room_type_id === item.id);
      let obj: roomDTO = {
        id: room?.id ?? 0,
        name: room?.name ?? item.name,
        room_type_id: room?.room_type_id ?? item.id,
        extra_bed_count: room?.extra_bed_count ?? item.extra_bed_count,
        isDisable: room?.isDisable ?? item.isDisable,
        is_twin_count: room?.is_twin_count ?? item.is_twin_count,
        online_reservation: room?.online_reservation ?? item.online_reservation,
        coefficient: room?.coefficient ?? item.coefficient,
        isSelected: room ? true : false,
        has_coefficient: false,
        Adl_capacity: room?.Adl_capacity ?? item.Adl_capacity,
        chd_capacity: room?.chd_capacity ?? item.chd_capacity,
        age_child: room?.age_child ?? item.age_child,
      }
      this.rooms.push(obj)
    })
  }

  setData(): void {
    debugger
    if (this.hotelInfo.post.options.no_bed_child_ages && this.hotelInfo.post.options.with_bed_child_ages) {
      this.noBedMax = this.hotelInfo.post.options.no_bed_child_ages.length > 1 ? this.hotelInfo.post.options.no_bed_child_ages[1] : 0;
      this.noBedMin = this.hotelInfo.post.options.no_bed_child_ages.length > 0 ? this.hotelInfo.post.options.no_bed_child_ages[0] : 0;
      this.withBedMin = this.hotelInfo.post.options.with_bed_child_ages.length > 0 ? this.hotelInfo.post.options.with_bed_child_ages[0] : 0;
      this.withBedMax = this.hotelInfo.post.options.with_bed_child_ages.length > 1 ? this.hotelInfo.post.options.with_bed_child_ages[1] : 0;

    }
    this.hotelForm.controls.title.setValue(this.hotelInfo.post.title);
    this.hotelForm.controls.titleEn.setValue(this.hotelInfo.post.options?.titleEn);
    this.hotelForm.controls.slug.setValue(this.hotelInfo.post.slug);
    // @ts-ignore
    this.hotelForm.controls.city_id.setValue(this.hotelInfo.city_id);
    this.hotelForm.controls.body.setValue(this.hotelInfo.post.body);
    this.hotelForm.controls.currency.setValue(this.hotelInfo.post.options?.currency_code);
    this.hotelForm.controls.location.setValue(this.hotelInfo.post.options?.location);
    if (this.hotelInfo.post.options.coordinates && this.hotelInfo.post.options.coordinates.length > 1) {
      this.lat = this.hotelInfo.post.options.coordinates[0];
      this.lng = this.hotelInfo.post.options.coordinates[1];
this.coordinates=[this.hotelInfo.post.options.coordinates[0],this.hotelInfo.post.options.coordinates[1]]
    }

    this.hotelForm.controls.description.setValue(this.hotelInfo.post.description ?? '');
    this.hotelForm.controls.address.setValue(this.hotelInfo.post.options.address ?? '');
    if (this.hotelInfo.post.options.stars) {
      this.currentStar = this.hotelInfo.post.options.stars;
    }
    this.getImagesFromData();
    this.setServiceChecked();
    let obj = this.hotelInfo.rooms.find(x => x.room_type === 'دوتخته' || x.room_type === 'دو تخته')
    if (obj && obj.has_coefficient) {
      this.isCoefficient = '1'
    } else {
      this.isCoefficient = '0'
    }
    // this.setRooms()
    // this.lat = this.hotelInfo.coordinate.lat
    // this.lng = this.hotelInfo.coordinate.lng
    this.reload()
  }




  getSelectedRoomList() {
    this.rooms.forEach(x => {
      if (x.isSelected) {
        let obj = {
          id: x.id,
          name: x.name,
          room_type_id: x.room_type_id,
          coefficient: x.coefficient,
          is_twin_count: x.is_twin_count,
          extra_bed_count: x.extra_bed_count,
          isDisable: x.isDisable,

          online_reservation: x.online_reservation,
          has_coefficient: x.has_coefficient,
          Adl_capacity: x.Adl_capacity,
          chd_capacity: x.chd_capacity,
          age_child: x.age_child,
        }
        this.selectedRooms.push(obj)
      }
    })
  }


  getEditImages(result: UploadResDTO[]): void {
    this.hotelImages = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? null,
        type: x.type
      }
      this.hotelImages.push(obj)
    })
  }

  getRemovedImages(event: any) {
    this.removedImages = event;
  }

  getThumbnailFromData() {
    let obj: UploadResDTO = {
      path: '',
      url: ''
    }
    this.hotelInfo.files.forEach(item => {
      if (item.type === 1) {
        obj = {
          path: item.path,
          url: item.url
        }
      }
    })
    return obj;
  }
  getImagesFromData() {
    this.hotelImages = []
    this.hotelInfo.files.forEach(item => {
      let obj = {
        path: item.path,
        url: item.url,
        id: item.id ?? null,
        alt: item.alt ?? '',
        type: item.type
      }
      this.hotelImages.push(obj);
    })

  }

  getRoomName(id: number) {
    return this.hotelInfo.roomTypes.filter(x => x.id === id)[0].name;
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

  setServiceChecked() {
    this.hotelInfo.services.forEach(item => {
      this.hotelInfo.service_ids.forEach(x => {
        if (item.id === x) {
          item.isSelected = true;
        }
      })
    })
  }

  setEditReq(): void {
    debugger
    this.getSelectedRoomList()
    this.getRemovedRooms()
    this.setHasCoefficients()
    this.req = {
      title: this.hotelForm.controls.title.value,
      titleEn: this.hotelForm.controls.titleEn.value,
      address: this.hotelForm.controls.address.value,
      stars: this.currentStar,
      location: this.hotelForm.controls.location.value,
      slug: this.hotelForm.controls.slug.value,
      currency_code: this.hotelForm.controls.currency.value ?? 'toman',
      status_id: 1,
      description: this.hotelForm.controls.description.value,
      body: '',
      categories: [],
      services: this.getCheckedServices(),
      comment: 0,
      coordinates: this.coordinates,
      del_files: this.removedImages,
      del_rooms: this.removedRoomsIDs,
      files: this.hotelImages,
      options: [],
      pin: 0,
      no_bed_child_ages: [this.noBedMin, this.noBedMax],
      with_bed_child_ages: [this.withBedMin, this.withBedMax],
      use_api: 0,
      city_id: this.hotelForm.controls.city_id.value,
      // @ts-ignore
      rooms: this.selectedRooms
    }
  }
  edit(): void {
    this.setEditReq();
    this.hotelApi.updatePosts('hotel', this.req, this.hotelId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.router.navigateByUrl('/panel/hotel')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.errors);
        this.errors = Object.values(error.error.errors)

        this.markFormGroupTouched(this.hotelForm);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
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


  getCheckedServices() {
    let list: any[] = []
    this.hotelInfo.services.forEach(item => {
      if (item.isSelected) {
        list.push(item.id);
      }
    })
    return list;
  }

}
