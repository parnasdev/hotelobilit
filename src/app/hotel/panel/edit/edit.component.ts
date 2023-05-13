import { Component, OnInit } from '@angular/core';
import { AddComponent } from "../add/add.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { InfoHotelDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {
  showData = false
  hotelName = '';

  hotelId = 1;
  roomTypes: roomDTO[] = []
  hotelInfo: InfoHotelDTO = {
    statuses: [],
    cities: [],

    roomTypes: [],
    post: {
      id: 0,
      user_id: 0,

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
    service_ids: [],
    city_id: 0,

  };

  public override show = true;
  showServices = false;
  hotelImages: UploadResDTO[] = [];
  removedImages: number[] = [];

  override ngOnInit(): void {
    this.errorService.clear();
    // @ts-ignore
    this.hotelId = this.route.snapshot.paramMap.get('id');
    this.getInfo();
  }

  setEditReq(): void {
    this.selectedRooms.forEach(x => {
      x.has_coefficient = x.has_coefficient
    })

    this.req = {
      title: this.hotelForm.controls.title.value,
      titleEn: this.hotelForm.controls.titleEn.value,
      address: this.hotelForm.controls.address.value,
      stars: this.currentStar,
      slug: this.hotelForm.controls.slug.value,
      status_id: 1,
      description: this.hotelForm.controls.description.value,
      body: '',
      categories: [],
      comment: 0,
      del_files: this.removedImages,
      files: this.hotelImages,
      options: [],
      pin: 0,
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

  getInfo(): void {
    this.isLoading = true;
    this.hotelApi.editPosts('hotel', this.hotelId).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.hotelInfo = res.data;
        this.roomTypes = this.hotelInfo.roomTypes;
        this.setData()
        this.showData = true
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }
  compare(c1: { name: string }, c2: { name: string }) {
    return c1 && c2 && c1.name === c2.name;
  }

  setData(): void {
    this.hotelForm.controls.title.setValue(this.hotelInfo.post.title);
    this.hotelForm.controls.titleEn.setValue(this.hotelInfo.post.options?.titleEn);
    this.hotelForm.controls.slug.setValue(this.hotelInfo.post.slug);
    // @ts-ignore
    this.hotelForm.controls.city_id.setValue(this.hotelInfo.city_id);
    this.hotelForm.controls.body.setValue(this.hotelInfo.post.body);
    this.hotelForm.controls.description.setValue(this.hotelInfo.post.description);
    this.hotelForm.controls.address.setValue(this.hotelInfo.post.options.address);
    this.currentStar = this.hotelInfo.post.options.stars;
    this.getImagesFromData();
    this.convertRoomsToListObjects()
    // this.lat = this.hotelInfo.coordinate.lat
    // this.lng = this.hotelInfo.coordinate.lng
    this.reload()
  }



  getEditImages(result: UploadResDTO[]): void {
    this.hotelImages = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? 0,
        type: x.type
      }
      this.hotelImages.push(obj)
    })
  }

  getRemovedImages(event: any) {
    this.removedImages = event;
  }



  convertRoomsToListObjects() {
    let list: any[] = [];
    this.hotelInfo.rooms.forEach(item => {
      let data = this.hotelInfo.roomTypes.find(x => x.id === item.room_type_id)?.name
      list.push(data)
    })
    // @ts-ignore
    this.selectedRoomsFC.setValue(list)
    this.setRoomCoeffision()
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


  setRoomCoeffision() {
    this.selectedRooms = [];
    this.hotelInfo.rooms.forEach(item => {
      let obj = {
        id: item.id,
        name: this.getRoomName(item.room_type_id),
        room_type_id: item.room_type_id,
        coefficient: item.coefficient,
        has_coefficient: item.has_coefficient,
        Adl_capacity: item.Adl_capacity,
        chd_capacity: item.chd_capacity,
        age_child: item.age_child,
      }
      this.selectedRooms.push(obj);
    })
  }

  getRoomName(id: number) {
    return this.hotelInfo.roomTypes.filter(x => x.id === id)[0].name
  }




  roomsUpdated() {
    this.selectedRooms = [];
    (this.selectedRoomsFC.value ?? []).forEach(item => {
      let result = this.hotelInfo.roomTypes.filter(x => x.name === item)
      if (result.length > 0) {
        let obj = {
          id: 0,
          name: result[0].name,
          room_type_id: result[0].id,
          has_coefficient: result[0].has_coefficient,
          coefficient: 0,
          Adl_capacity: result[0].Adl_capacity,
          chd_capacity: result[0].chd_capacity,
          age_child: result[0].age_child,
        }
        this.selectedRooms.push(obj);
      }
    })
  }
}
