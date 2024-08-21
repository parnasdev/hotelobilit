import { Component, OnInit } from '@angular/core';
import { PermissionDTO, UserCreateReq, UserReqDTO, UserResDTO, UserRolesDTO } from "../../Core/Models/UserDTO";
import { FormBuilder, FormControl } from "@angular/forms";
import { CheckErrorService } from "../../Core/Services/check-error.service";
import { ErrorsService } from "../../Core/Services/errors.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonApiService } from "../../Core/Https/common-api.service";
import { SessionService } from "../../Core/Services/session.service";
import { CalenderServices } from "../../Core/Services/calender-service";
import { PublicService } from "../../Core/Services/public.service";
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { MessageService } from "../../Core/Services/message.service";
import { UserApiService } from "../../Core/Https/user-api.service";
import { Location } from '@angular/common';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userId = '';
  userInfo: any;


  isLoading = false;
  permissions: { id: number, label: string, isChecked?: boolean }[] = []
  modeNM = 'profile'
  roles: { id: number; label: string }[] = [];
  userReq: UserCreateReq = {
    agency_name: '',
    agency_tell: '',
    agency_address: '',
    parent_id: 0,
    agency_necessary_phone: '',
    name: '',
    family: '',
    username: '',
    phone: '',
    permissions: [],
    password: '',
    role_id: 1,
    hotels: []
  }
  selectedCity = new FormControl();
  filteredHotel: any[] = [];
  parent: string | null = '0';
  cities: { id: number, name: string }[] = [];
  hotels: any[] = [];
  selectedhotels: any[] = []

  hotelItem: any
  userForm = this.fb.group({
    agency_name: new FormControl(''),
    agency_tell: new FormControl(''),
    agency_address: new FormControl(''),
    agency_necessary_phone: new FormControl(''),
    parent_id: new FormControl(''),
    name: new FormControl(''),
    family: new FormControl(''),
    agency_id: new FormControl(''),
    username: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    role_id: new FormControl()
  });

  role: string = '';
  errors: any
  agency = ''
  agencies: any[] = []
  showAgencies = false;
  constructor(public fb: FormBuilder,
    public api: UserApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public errorService: ErrorsService,
    public message: MessageService,
    private _location: Location,
    public checkError: CheckErrorService,
    public router: Router,
    public commonApi: CommonApiService,
    public session: SessionService,
    public calenderServices: CalenderServices,
    public mobileService: ResponsiveService,
    public publicServices: PublicService) {
    this.route.queryParams.subscribe(params => {
      this.agency = params['agency'];
    });
  }
  ngOnInit(): void {
    // @ts-ignore
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.parent = this.route.snapshot.paramMap.get('parent');
    this.getUser();
    this.role = this.session.getRole()
  }

  // getAgencies(): void {
  //   this.isLoading = true;
  //   this.api.getUser(5).subscribe((res: any) => {
  //     if (res.isDone) {
  //       this.agencies = res.data
  //       if (this.agencies.length > 0) {
  //         this.showAgencies = true
  //       }
  //       this.fillForm();
  //     } else {
  //       this.message.custom(res.message);
  //     }
  //     this.isLoading = false;
  //   }, (error: any) => {
  //     this.isLoading = false;
  //     this.message.error();
  //     this.checkErrorService.check(error);
  //   });
  // }

  getUser(): void {
    this.isLoading = true
    this.api.getEditData(+this.userId).subscribe((res: any) => {
      if (res.isDone) {
        this.userInfo = res.data;
        this.roles = res.data.roles;
        this.hotels = res.data.hotels;
        this.agencies = res.data.users
        // this.getAgencies();
        this.getCities()
        this.permissions = res.data.permissions;
        this.fillForm();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false

    }, (error: any) => {
      this.isLoading = false
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  getCities() {
    this.cities = []
    this.hotels.forEach(hotel => {
      let cityFiltered = this.cities.filter(c => c.id === hotel.city.id);
      if (cityFiltered.length === 0) {
        this.cities.push(hotel.city);
      }
    })

    this.selectedCity.setValue(this.getLastSelectedCities())
    this.setHotelSelection();
  }
  getHotel(hotel: any) {
    this.hotelItem = hotel
  }

  setToUserName() {
    this.userForm.controls.username.setValue(this.userForm.controls.phone.value);
  }


  addHotel() {
    debugger
    let isExist = false;
    this.selectedhotels.forEach(hotel => {
      if (hotel.title === this.hotelItem.newhotel.title) {
        isExist = true
      }
    })
    if (!isExist) {
      this.selectedhotels.push(this.hotelItem.newhotel)
    } else {
      this.message.custom('هتل تکراری است')
    }
    // console.log(this.selectedhotels)
  }
  getLastSelectedCities(): number[] {
    let result: number[] = []
    this.userInfo.hotelIds.forEach((id: number) => {
      let filteredItems = this.hotels.filter(x => x.id === id);
      if (filteredItems.length > 0) {
        result.push(filteredItems[0].city.id)
      }
    })
    let unicList = Array.from(result.reduce((m, t) => m.set(t, t), new Map()).values());

    return unicList
  }

  fillForm(): void {
    this.userForm.controls.agency_name.setValue(this.userInfo.user.agency_name);
    this.userForm.controls.agency_address.setValue(this.userInfo.user.agency_address);
    this.userForm.controls.agency_tell.setValue(this.userInfo.user.agency_tell);
    this.userForm.controls.agency_necessary_phone.setValue(this.userInfo.user.agency_necessary_phone);
    this.userForm.controls.name.setValue(this.userInfo.user.name);
    this.userForm.controls.name.setValue(this.userInfo.user.name);
    this.userForm.controls.family.setValue(this.userInfo.user.family);
    this.userForm.controls.phone.setValue(this.userInfo.user.phone);
    this.userForm.controls.username.setValue(this.userInfo.user.username);
    this.userForm.controls.role_id.setValue(this.userInfo.user.role_id);
    this.userForm.controls.parent_id.setValue(this.userInfo.user.parent_id);
    this.userForm.controls.agency_id.setValue(this.userInfo.user.parent_id);


    this.permissions.forEach((item: any) => {
      let result = this.userInfo.permissionIds.filter((x: number) => item.id === x);
      if (result.length > 0) {
        item.isChecked = true;
      }
    })


    // if (this.userInfo.user.role_id === 8 && (this.session.getRole() === 'admin' || this.session.getRole() === 'programmer')) {
    //   this.permissions = this.permissions.filter(x => x.isChecked);
    // }

  }
  getIsAgency() {
    return this.agency !== '' ||  (+(this.userForm.get('role_id')?.value ?? '0') === 12 ||  +(this.userForm.get('role_id')?.value ?? '0') === 5  || +(this.userForm.get('role_id')?.value ?? '0') === 4 || +(this.userForm.get('role_id')?.value ?? '0') === 3)
  }
  setReq(mode: string) {
    this.userReq = {
      agency_name: this.userForm.value.agency_name ?? '',
      agency_tell: this.userForm.value.agency_tell ?? '',
      agency_address: this.userForm.value.agency_address ?? '',
      agency_necessary_phone: this.userForm.value.agency_necessary_phone ?? '',
      name: this.userForm.value.name ?? '',
      family: this.userForm.value.family ?? '',
      phone: this.userForm.value.phone ?? '',
      edit_mode: mode,
      permissions: this.getPermissionsIDs(),
      parent_id: +(this.userForm.value.agency_id ?? '0'),
      password: this.userForm.value.password ?? '',
      username: this.userForm.value.username ?? '',
      role_id: !this.parent ? this.userForm.value.role_id ?? 0 : 8,
      hotels: this.getHotelNumberArray()
    };
  }

  checkPermissions() {
    this.permissions.forEach(y => y.isChecked = false)
    let role_id = this.userForm.controls['role_id'].value;
    let roleFiltered: any = this.roles.filter(role => role.id === +(role_id ?? '0'));
    if (roleFiltered.length > 0) {
      this.permissions.forEach((item: any) => {
        let result = roleFiltered[0].permissions.filter((x: number) => item.id === x);
        if (result.length > 0) {
          item.isChecked = true;
        }
      })
    }

  }
  selectAll() {
    this.selectedhotels = [];
    this.filteredHotel.forEach(res => {
      this.selectedhotels.push(res)
    })
  }

  getHotelNumberArray() {
    let result: number[] = []
    this.selectedhotels.forEach(x => {
      result.push(x.id)
    })
    return result
  }

  setHotelSelection() {
    this.selectionChange()
    this.userInfo.hotelIds.forEach((x: number) => {
      let itemFiltered = this.hotels.filter(hotel => hotel.id === x)
      if (itemFiltered.length > 0) {
        this.selectedhotels.push(itemFiltered[0]);
      }
    })

  }
  getPermissionsIDs() {
    let result: number[] = []
    this.permissions.forEach(item => {
      if (item.isChecked) {
        result.push(item.id)
      }
    })
    return result;
  }


  modeChanged(event: any) {

  }


  selectionChange() {
    this.filteredHotel = [];
    this.selectedCity.value.forEach((city: any) => {
      this.hotels.forEach(hotel => {
        if (hotel.city.id === city) {
          this.filteredHotel.push(hotel)
        }
      })
    })
  }

  submit(mode: string) {
    this.setReq(mode);
    this.api.editUser(this.userReq, this.userId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this._location.back()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
        this.errors = Object.values(error.error.errors)

        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  getHotelName(id: number) {
    return this.filteredHotel.find((y: any) => y.id === id)?.title
  }

  getCityName(id: number) {
    return this.cities.find((y: any) => y.id === id)?.name
  }

  deleteCityItem(index: number) {
    this.selectedCity.value.splice(index, 1)
    this.selectionChange();
  }


  deleteItem(index: number) {
    this.selectedhotels.splice(index, 1)
  }
}
