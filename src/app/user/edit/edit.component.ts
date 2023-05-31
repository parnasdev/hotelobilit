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
import {Location} from '@angular/common';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userId = '';
  userInfo: any;
  permissions: { id: number, label: string, isChecked?: boolean }[] = []

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
  selectedhotelsFC = new FormControl();
  userForm = this.fb.group({
    agency_name: new FormControl(''),
    agency_tell: new FormControl(''),
    agency_address: new FormControl(''),
    agency_necessary_phone: new FormControl(''),
    name: new FormControl(''),
    family: new FormControl(''),
    username: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    role_id: new FormControl()
  });

  role: string = '';
  errors: any

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
  }
  ngOnInit(): void {
    // @ts-ignore
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.parent = this.route.snapshot.paramMap.get('parent');

    this.getUser();
    this.role = this.session.getRole()
  }

  getUser(): void {
    this.api.getEditData(+this.userId).subscribe((res: any) => {
      if (res.isDone) {
        this.userInfo = res.data;
        this.roles = res.data.roles;
        this.hotels = res.data.hotels;
        this.getCities()
        this.permissions = res.data.permissions;

        this.fillForm();
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
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

  getLastSelectedCities(): number[] {
    let result: number[] = []
    this.userInfo.hotelIds.forEach((id: number) => {
      let filteredItems = this.hotels.filter(x => x.id === id);
      if (filteredItems.length > 0) {
        result.push(filteredItems[0].city.id)
      }
    })
    return result
  }

  fillForm(): void {
    this.userForm.controls.agency_name.setValue(this.userInfo.user.agency_name);
    this.userForm.controls.agency_address.setValue(this.userInfo.user.agency_address);
    this.userForm.controls.agency_tell.setValue(this.userInfo.user.agency_tell);
    this.userForm.controls.agency_necessary_phone.setValue(this.userInfo.user.agency_necessary_phone);

    this.userForm.controls.name.setValue(this.userInfo.user.name);
    this.userForm.controls.family.setValue(this.userInfo.user.family);
    this.userForm.controls.phone.setValue(this.userInfo.user.phone);
    this.userForm.controls.username.setValue(this.userInfo.user.username);
    this.userForm.controls.role_id.setValue(this.userInfo.user.role_id);

    this.permissions.forEach((item: any) => {
      let result = this.userInfo.permissionIds.filter((x: number) => item.id === x);
      if (result.length > 0) {
        item.isChecked = true;
      }
    })

  }
  setReq() {
    this.userReq = {
      agency_name: this.userForm.value.agency_name ?? '',
      agency_tell: this.userForm.value.agency_tell ?? '',
      agency_address: this.userForm.value.agency_address ?? '',
      agency_necessary_phone: this.userForm.value.agency_necessary_phone ?? '',
      name: this.userForm.value.name ?? '',
      family: this.userForm.value.family ?? '',
      phone: this.userForm.value.phone ?? '',
      edit_mode: 'profile',
      permissions: this.getPermissionsIDs(),
      parent_id: this.parent ? +this.parent : 0,
      password: this.userForm.value.password ?? '',
      username: this.userForm.value.username ?? '',
      role_id: this.userForm.value.role_id ?? 0,
      hotels: this.selectedhotelsFC.value
    };
  }
  setHotelSelection() {
    this.selectionChange()
    this.selectedhotelsFC.setValue(this.userInfo.hotelIds)
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

  submit() {
    this.setReq();
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
    this.selectedhotelsFC.value?.splice(index, 1)
  }

}
