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
      options: [],
      pin: false,
      comment: false,
      post_type: '',
      status_id: 0,
      deleted_at: '',
      created_at: '',
      updated_at: '',
      files: []
    },
    files: [],
    service_ids: [],
    city_id: 0,
    rooms: []
  };
  public override show = true;
  showServices = false;
  convertedImages:UploadResDTO[] = [];

  override ngOnInit(): void {
    this.errorService.clear();
    // @ts-ignore
    this.hotelName = this.route.snapshot.paramMap.get('slug');
    this.getInfo();
  }

  // getServices(): void {
  //   this.showServices = false
  //   this.hotelApi.getServices().subscribe((res: any) => {
  //     if (res.isDone) {
  //       this.services = res.data
  //       this.setData()
  //       this.showServices = true

  //     } else {
  //       this.showServices = false

  //       this.message.custom(res.message)
  //     }
  //   }, (error: any) => {
  //     this.showServices = false
  //     this.message.error()

  //   })
  // }

  edit(): void {
    this.setReq()
    this.hotelApi.updatePosts('hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        // this.router.navigateByUrl('/panel/hotel/list')
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
    this.hotelApi.editPosts('hotel').subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.hotelInfo = res.data;
        // this.currentStar = +this.hotelInfo.stars;
        // this.cityTypeFC.setValue(this.hotelInfo.city.type != 0)
        this.getRoomTypes()
        // this.getCities()
        this.getServices()
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

  // getRoomTypes(): void {
  //   const req = {
  //     paginate: false,
  //     perPage: 20
  //   }
  //   this.roomTypeApi.getRoomTypes(req).subscribe((res: any) => {
  //     if (res.isDone) {
  //       this.roomTypes = res.data;
  //       this.selectedRoomsFC.setValue(this.hotelInfo.rooms)
  //       console.log(this.selectedRoomsFC.value);
        
  //     } else {
  //       this.message.custom(res.message);
  //     }
  //   }, (error: any) => {
  //     this.message.error()
  //   })
  // }

  setData(): void {
    // this.hotelForm.controls['name'].setValue(this.hotelInfo.name);
    // this.hotelForm.controls['nameEn'].setValue(this.hotelInfo.nameEn);
    // this.hotelForm.controls['city'].setValue(this.hotelInfo.city.id);
    // this.hotelForm.controls['location'].setValue(this.hotelInfo.location);
    // this.hotelForm.controls['address'].setValue(this.hotelInfo.address);
    // this.hotelForm.controls['body'].setValue(this.hotelInfo.body);
    // this.hotelForm.controls['stars'].setValue(this.hotelInfo.stars);
    // this.convertImagesToListObjects()
    // if (this.hotelInfo.mediaLink) {
    //   if (this.hotelInfo.mediaLink.length > 0) {
    //     this.aparatFC.setValue(this.hotelInfo.mediaLink[0].link)
    //     this.youtubeFC.setValue(this.hotelInfo.mediaLink[1].link)
    //   }
    // }
    // this.images = this.hotelInfo.images_paths ?? []
    // this.thumbnail = this.hotelInfo.thumbnail_paths ?? ''; 
    // this.lat = this.hotelInfo.coordinate.lat
    // this.lng = this.hotelInfo.coordinate.lng
    // this.reload()
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
}
