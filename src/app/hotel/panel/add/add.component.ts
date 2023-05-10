import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../../Core/Services/message.service";
import { CommonApiService } from "../../../Core/Https/common-api.service";
import { SessionService } from "../../../Core/Services/session.service";
import { CalenderServices } from "../../../Core/Services/calender-service";
import { PublicService } from "../../../Core/Services/public.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MapApiService } from "../../../Core/Https/map-api.service";
import { MapReverseDTO } from "../../../Core/Models/mapDTO";
import { CityDTO } from "../../../Core/Models/cityDTO";
import { CityApiService } from "../../../Core/Https/city-api.service";
import { MatDialog } from "@angular/material/dialog";
import { ErrorsService } from "../../../Core/Services/errors.service";
import { CheckErrorService } from "../../../Core/Services/check-error.service";
import { RoomTypeApiService } from 'src/app/Core/Https/room-type-api.service';
import { citiesDTO, hotelPageDTO, roomDTO, storeHotelSetReqDTO } from 'src/app/Core/Models/newPostDTO';
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  aparatFC = new FormControl('');
  youtubeFC = new FormControl('');
  selectedRoomsFC = new FormControl([]);
  currentStar = 0;
  lat = 0;
  lng = 0;
  reverseAddressData!: MapReverseDTO;
  cities: CityDTO[] = [];
  citiesResponse: citiesDTO[] = []
  cityTypeFC = new FormControl(true)
  public show = true;
  images: UploadResDTO[] = [];
  errors: any


  req: storeHotelSetReqDTO = {
    title: '',
    titleEn: '',
    slug: '',
    status_id: 1,
    description: '',
    body: '',
    address: '',
    stars: 0,
    comment: 0,
    use_api: 0,
    city_id: 0,
    rooms: [],
    categories: [],
    del_files: [],
    files: [],
    options: [],
    pin: 0
  }
  images1: any[] = [];
  thumbnail = ''
  data: hotelPageDTO = {
    cities: [],
    statuses: [],
    roomTypes: []
  }
  serviceIDs: string[] = [];
  isLoading = false;

  selectedRooms: roomDTO[] = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
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

  //formGroup
  hotelForm = this.fb.group({
    title: new FormControl('', [Validators.required]),
    titleEn: new FormControl('', [Validators.required]),
    slug: new FormControl('', [Validators.required]),
    status_id: new FormControl('1', Validators.required),
    description: new FormControl(''),
    body: new FormControl(''),
    address: new FormControl(''),
    city_id: new FormControl(null, Validators.required),
    stars: new FormControl(''),
  });


  ngOnInit(): void {
    this.errorService.clear();
    this.getData();
  }


  getLatLng(latLng: any): void {
    this.lat = latLng.lat;
    this.lng = latLng.lng;
    this.reverseAddress(latLng.token)
  }

  reverseAddress(token: string): void {
    this.mapApi.reverse(this.lat, this.lng, token).subscribe((res: any) => {
      if (res) {
        this.reverseAddressData = res
        // this.hotelForm?.value?.address?.setValue(res.address_compact)
      } else {
        // this.hotelForm.value.address.setValue('')
        this.lat = this.cities[0].coordinates[1];
        this.lng = this.cities[0].coordinates[0];
        this.message.showMessageBig('این استان پشتیبانی نمیشود')
        this.reload()
      }
    })
  }

  roomChanged() {
    this.selectedRooms = [];
    (this.selectedRoomsFC.value ?? []).forEach(item => {
      let result = this.data.roomTypes.filter(x => x.name === item)
      if (result.length > 0) {
        let obj = {
          id: 0,
          name: result[0].name,
          room_type_id: result[0].id,
          has_coefficient: result[0].has_coefficient ? 1 : 0,
          coefficient: 0,
          Adl_capacity: result[0].Adl_capacity,
          chd_capacity: result[0].chd_capacity,
          age_child: result[0].age_child,
        }
        this.selectedRooms.push(obj);
      }
    })
  }

  getData(): void {
    this.hotelApi.createPosts('hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  setReq(): void {
    this.req = {
      title: this.hotelForm.controls.title.value,
      titleEn: this.hotelForm.controls.titleEn.value,
      address: this.hotelForm.controls.address.value,
      stars:  this.currentStar,
      slug: this.hotelForm.controls.slug.value,
      status_id: 1,
      description: this.hotelForm.controls.description.value,
      body: '',
      categories: [],
      comment: 0,
      del_files: [],
      files: this.images,
      options: [],
      pin: 0,
      use_api: 0,
      city_id: this.hotelForm.controls.city_id.value,
      // @ts-ignore
      rooms: this.selectedRooms
    }
  }


  cityTypeChange(): void {
    this.lat = 0;
    this.lng = 0;
    this.citiesResponse = this.data.cities;
  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }

  getFiles(result: UploadResDTO[]): void {
    // this.images = [];
    // result.forEach(file => {
    //   this.images.push(file.path)
    // });
    // this.generateFilesForReq(this.images, 2);
  }




  getImages(result: UploadResDTO[]): void {
    this.images = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? null,
        type :x.type
      }
      this.images.push(obj)
    })
  }



  getDescriptionFromEditor(body: any): void {
    this.hotelForm.controls['body'].setValue(body);
  }

  markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  add(): void {
    this.setReq()
    this.hotelApi.storePosts('hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.router.navigateByUrl('panel/hotel')
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

  getServicesResult(services: any): void {
    this.serviceIDs = [];
    services.forEach((x: any) => {
      this.serviceIDs.push(x.id.toString());
    })
  }

  generateSlug(): void {
    this.hotelForm.value.slug = this.hotelForm.controls.title.value?.split(' ').join('-')
  }
}
