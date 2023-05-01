import { Component, OnInit } from '@angular/core';
import { hotelInfoDTO } from "../../../Core/Models/hotelDTO";
import { AddComponent } from "../add/add.component";
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { InfoHotelDTO } from 'src/app/Core/Models/newPostDTO';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {

  hotelName = '';
  hotelId = 1;
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
  convertedImages:UploadResDTO[] = [];

  override ngOnInit(): void { 
    this.errorService.clear();
    // @ts-ignore
    this.hotelId = this.route.snapshot.paramMap.get('id');
    this.getInfo();
  }

  edit(): void {
    this.setReq()
    this.hotelApi.updatePosts('hotel', this.req, this.hotelId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.router.navigateByUrl('/panel/hotel')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
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
        this.setData()
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
  }
  compare(c1: {name: string}, c2: {name: string}) {
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
    this.currentStar = this.hotelInfo.post.options.stars
    this.convertImagesToListObjects()
    this.convertRoomsToListObjects()
    this.images = this.hotelInfo.files ?? []
    this.thumbnail = this.hotelInfo.files[0] ?? '';
    // this.lat = this.hotelInfo.coordinate.lat
    // this.lng = this.hotelInfo.coordinate.lng
    this.reload()
  }

  convertImagesToListObjects() {
    this.convertedImages = [];
    this.hotelInfo.files.forEach((x: any) => {
      let item: UploadResDTO = {
        path: '',
        url: x
      }
      this.convertedImages.push(item)
    })
  }

  getThumbnailHotel(): string{
    return ''
  }

  convertRoomsToListObjects(){
    let list: any[] = [];
    this.hotelInfo.rooms.forEach(item => {
    let data = this.hotelInfo.roomTypes.find(x => x.id === item.room_type_id)?.name
      list.push(data)
    })
    // @ts-ignore
    this.selectedRoomsFC.setValue(list)
    this.roomChanged()
  }
}
