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
import { categoriesDTO, citiesDTO, hotelPageDTO, roomDTO, storeHotelSetReqDTO } from 'src/app/Core/Models/newPostDTO';
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  aparatFC = new FormControl('');
  youtubeFC = new FormControl('');
  currentStar = 0;
  lat = 35.715731;
  lng = 51.384159;
  coordinates:any=[0,0]

  getCoordinates(){
    // debugger
    this.coordinates = this.coordinates.split(',');
    // this.lat = +newCoordinates[0];
    // this.lng = +newCoordinates[1];
    // console.log(newCoordinates)
  }

  reverseAddressData!: MapReverseDTO;
  cities: CityDTO[] = [];
  citiesResponse: citiesDTO[] = []
  cityTypeFC = new FormControl(true)
  public show = true;
  images: UploadResDTO[] = [];
  errors: any
  isCoefficient: string = '0';



  req: storeHotelSetReqDTO = {
    title: '',
    titleEn: '',
    slug: '',
    status_id: 1,
    description: '',
    location: '',
    coordinates: [0, 0],
    currency_code: '',
    services: [],
    with_bed_child_ages:[],
    no_bed_child_ages: [],
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
    roomTypes: [],
    services: []
  }
  serviceIDs: string[] = [];
  isLoading = false;

  noBedMin = 0;
  noBedMax = 0;
  withBedMin = 0;
  withBedMax = 0;

  showServices = false;

  selectedRooms: roomDTO[] = [];
  rooms: roomDTO[] = []

  newCities: categoriesDTO[] = []
  showCities = false;

  constructor(
    public title: Title,
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
    location: new FormControl(''),
    currency: new FormControl('all'),
    body: new FormControl(''),
    address: new FormControl(''),
    city_id: new FormControl(null, Validators.required),
    stars: new FormControl(''),
  });


  ngOnInit(): void {
    this.title.setTitle('افزودن هتل | هتل و بلیط')

    this.errorService.clear();
    this.getData();
  }


  getLatLng(latLng: any): void {
    this.lat = latLng.lat;
    this.lng = latLng.lng;
  }

  // reverseAddress(token: string): void {
  //   this.mapApi.reverse(this.lat, this.lng, token).subscribe((res: any) => {
  //     if (res) {
  //       this.reverseAddressData = res
  //       // this.hotelForm?.value?.address?.setValue(res.address_compact)
  //     } else {
  //       // this.hotelForm.value.address.setValue('')
  //       this.lat = this.cities[0].coordinates[1];
  //       this.lng = this.cities[0].coordinates[0];
  //       this.message.showMessageBig('این استان پشتیبانی نمیشود')
  //       this.reload()
  //     }
  //   })
  // }



  getData(): void {
    this.hotelApi.createPosts('hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.data = res.data;
        this.createRoomsList()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.checkError.check(error);
      this.message.error()
    })
  }

  createRoomsList() {
    this.data.roomTypes.forEach((item: any) => {
      let obj: roomDTO = {
        id: 0,
        name: item.name,
        room_type_id: item.id,
        coefficient: item.coefficient,
        extra_bed_count: item.extra_bed_count,
        isDisable: item.isDisable,
        online_reservation: item.online_reservation,
        isSelected: false,
        has_coefficient: false,
        Adl_capacity: item.Adl_capacity,
        chd_capacity: item.chd_capacity,
        age_child: item.age_child,
      }
      this.rooms.push(obj)
    })

  }


  setHasCoefficient() {
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
          x.coefficient = 1
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

  setReq(): void {
    this.getSelectedRooms()
    this.setHasCoefficient()

    this.req = {
      title: this.hotelForm.controls.title.value,
      titleEn: this.hotelForm.controls.titleEn.value,
      address: this.hotelForm.controls.address.value,
      stars: this.currentStar,
      slug: this.hotelForm.controls.slug.value,
      location: this.hotelForm.controls.location.value,
      currency_code: this.hotelForm.controls.currency.value ?? 'toman',
      status_id: 1,
      description: this.hotelForm.controls.description.value,
      body: '',
      services: this.getSelectedServices(),
      categories: [],
      comment: 0,
      no_bed_child_ages: [this.noBedMin, this.noBedMax],
      with_bed_child_ages: [this.withBedMin, this.withBedMax],
      del_files: [],
      coordinates: [this.lat, this.lng],
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



  getSelectedServices() {
    let list: any[] = []
    this.data.services.forEach(item => {
      if (item.isSelected) {
        list.push(item.id);
      }
    })
    return list;
  }


  getImages(result: UploadResDTO[]): void {
    this.images = [];
    result.forEach(x => {
      let obj: UploadResDTO = {
        path: x.path,
        url: x.url,
        id: x.id ?? null,
        type: x.type
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



  getSelectedRooms() {
    this.rooms.forEach(x => {
      if (x.isSelected) {
        let obj = {
          id: x.id,
          name: x.name,
          room_type_id: x.room_type_id,
          coefficient: x.coefficient,
          is_twin_count: x.is_twin_count,
          isDisable: x.isDisable,
          extra_bed_count: x.extra_bed_count,
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
  // coefficientChanged(id: number) {
  //   this.selectedRooms.forEach(x => {
  //     if (x.room_type_id === id) {
  //       x.has_coefficient = true
  //     } else {
  //       x.has_coefficient = false

  //     }
  //   })
  // }
  getServicesResult(services: any): void {
    this.serviceIDs = [];
    services.forEach((x: any) => {
      this.serviceIDs.push(x.id.toString());
    })
  }

  generateSlug(): void {
    this.hotelForm.value.slug = this.hotelForm.controls.title.value?.split(' ').join('-')
  }


  getCitySelected(item: any): void {
    this.hotelForm.controls['city_id'].setValue(item.id);
  }
}
