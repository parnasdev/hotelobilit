import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HotelApiService } from "../../../Core/Https/hotel-api.service";
import { MessageService } from "../../../Core/Services/message.service";
import { CommonApiService } from "../../../Core/Https/common-api.service";
import { SessionService } from "../../../Core/Services/session.service";
import { CalenderServices } from "../../../Core/Services/calender-service";
import { PublicService } from "../../../Core/Services/public.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MapApiService } from "../../../Core/Https/map-api.service";
import { MapReverseDTO } from "../../../Core/Models/mapDTO";
import { CityDTO, CityListRequestDTO, CityResponseDTO } from "../../../Core/Models/cityDTO";
import { HotelSetRequestDTO, ServiceDTO } from "../../../Core/Models/hotelDTO";
import { CityApiService } from "../../../Core/Https/city-api.service";
import { MatDialog } from "@angular/material/dialog";
import { ErrorsService } from "../../../Core/Services/errors.service";
import { CheckErrorService } from "../../../Core/Services/check-error.service";
import { RoomTypeApiService } from 'src/app/Core/Https/room-type-api.service';
import { RoomTypeListDTO } from 'src/app/Core/Models/roomTypeDTO';
import { citiesDTO, hotelPageDTO, storeHotelReqDTO, storeHotelSetReqDTO } from 'src/app/Core/Models/newPostDTO';
import { UploadResDTO } from 'src/app/Core/Models/commonDTO';
import { PostApiService } from 'src/app/Core/Https/post-api.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  aparatFC = new FormControl('');
  youtubeFC = new FormControl('');
  selectedRoomsFC = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  currentStar = 0;
  lat = 0;
  lng = 0;
  reverseAddressData!: MapReverseDTO;
  cities: CityDTO[] = [];
  citiesResponse: citiesDTO[] = []
  cityTypeFC = new FormControl(true)
  public show = true;
  req: storeHotelSetReqDTO = {
    title: '',
    slug: '',
    status_id: 0,
    description: '',
    body: '',
    use_api: 0,
    city_id: 0,
    rooms: []
  }
  images: any[] = [];
  thumbnail = ''
  data: hotelPageDTO = {
    cities: [],
    statuses: []
  }
  serviceIDs: string[] = [];
  isLoading = false;
  roomTypes: RoomTypeListDTO[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
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
    name: new FormControl('', [Validators.required]),
    nameEn: new FormControl('', [Validators.required]),
    city: new FormControl('', Validators.required),
    status: new FormControl('Show', Validators.required),
    location: new FormControl(''),
    address: new FormControl(''),
    body: new FormControl(''),
    stars: new FormControl(''),
  });


  ngOnInit(): void {
    this.errorService.clear();
    // this.getServices();
    // this.getCities()
    this.getRoomTypes();
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

  getRoomTypes(): void {
    const req = {
      paginate: false,
      perPage: 20
    }
    this.roomTypeApi.getRoomTypes(req).subscribe((res: any) => {
      if (res.isDone) {
        this.roomTypes = res.data;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }


  

  setReq(): void {
    this.req = {
      title: '',
      slug: '',
      status_id: 0,
      description: '',
      body: '',
      use_api: 0,
      city_id: 0,
      rooms: []
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
    this.images = [];
    result.forEach(file => {
      this.getImage(file.path);
    });
  }

  getImage(imageStr: string): void {
    this.images.push(imageStr)
  }

  getThumbnail(image: UploadResDTO): void {
    this.thumbnail = image.path;
  }

  getServices(): void {
    this.hotelApi.createPosts('hotel').subscribe((res: any) => {
      if (res.isDone) {
        // this.services = res.data;
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.message.error()

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
        this.router.navigateByUrl('panel/hotel/list')
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

  getServicesResult(services: any): void {
    this.serviceIDs = [];
    services.forEach((x: any) => {
      this.serviceIDs.push(x.id.toString());
    })
  }


}
