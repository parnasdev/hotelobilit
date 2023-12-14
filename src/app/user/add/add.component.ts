import { Component, OnInit } from '@angular/core';
import { UserCreateReq } from "../../Core/Models/UserDTO";
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
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  //public Variable
  isMobile: any;
  isLoading = false;
  roles: { id: number; label: string; permissions: number[] }[] = [];
  hotels: any[] = [];
  selectedCity = new FormControl();
  filteredHotel: any[] = [];
  permissions: { id: number, label: string, isChecked?: boolean }[] = []
  errors: any
  parent: string | null = '0';
  cities: { id: number, name: string }[] = [];
  userReq: UserCreateReq = {
    agency_name: '',
    agency_tell: '',
    agency_address: '',
    agency_necessary_phone: '',
    parent_id: 0,
    name: '',
    permissions: [],
    family: '',
    username: '',
    phone: '',
    password: '',
    role_id: 1,
    hotels: []
  }
  selectedhotels: any[] = []
  hotelItem: any
  setPermissions: string[] = [];
  submitLoading = false;
  constructor(public fb: FormBuilder,
    public api: UserApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public errorService: ErrorsService,
    public message: MessageService,
    public checkError: CheckErrorService,
    private _location: Location,
    public router: Router,
    public commonApi: CommonApiService,
    public session: SessionService,
    public calenderServices: CalenderServices,
    public mobileService: ResponsiveService,
    public publicServices: PublicService) {
    this.isMobile = mobileService.isMobile();
  }

  userForm = this.fb.group({
    agency_name: new FormControl(),
    agency_tell: new FormControl(),
    agency_address: new FormControl(),
    agency_necessary_phone: new FormControl(),
    name: new FormControl(''),
    family: new FormControl(''),
    username: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    role_id: new FormControl(2)
  });

  ngOnInit(): void {
    this.parent = this.route.snapshot.paramMap.get('parent');
    this.getData();
  }

  getData() {
    this.api.getCreateData().subscribe((res: any) => {
      if (res.isDone) {
        this.roles = res.data.roles;
        if (!this.parent) {
          this.roles = this.roles.filter(x => x.label !== 'کارمند')
        }
        this.permissions = res.data.permissions;
        this.hotels = res.data.hotels;
        this.getCities()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  getCities() {
    this.hotels.forEach(hotel => {
      let cityFiltered = this.cities.filter(c => c.id === hotel.city.id);
      if (cityFiltered.length === 0) {
        this.cities.push(hotel.city);
      }
    })
  }

  markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  checkPermissions() {

    this.permissions.forEach(y => y.isChecked = false)
    let role_id = this.userForm.controls['role_id'].value;
    let roleFiltered:any = this.roles.filter(role => role.id === +(role_id ?? '0'));
    if(roleFiltered.length > 0) {
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
  getHotelNumberArray() {
    let result: number[] = []
    this.selectedhotels.forEach(x => {
      result.push(x.id)
    })
    return result
  }

  setReq() {
    this.userReq = {
      agency_name: this.userForm.value.agency_name ?? '',
      agency_tell: this.userForm.value.agency_tell ?? '',
      agency_address: this.userForm.value.agency_address ?? '',
      agency_necessary_phone: this.userForm.value.agency_necessary_phone ?? '',
      name: this.userForm.value.name ?? '',
      family: this.userForm.value.family ?? '',
      parent_id: this.parent ? +this.parent : 0,
      phone: this.userForm.value.phone ?? '',
      password: this.userForm.value.password ?? '',
      username: this.userForm.value.username ?? '',
      permissions: this.getPermissionsIDs(),
      role_id: !this.parent ? this.userForm.value.role_id ?? 0 : 8,
      hotels: this.getHotelNumberArray()
    };
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

  getHotel(hotel: any) {
    this.hotelItem = hotel
  }


  addHotel() {
    this.selectedhotels.push(this.hotelItem)
  }
  submit() {
    this.setReq();
    this.submitLoading = true
    this.api.createUser(this.userReq).subscribe((res: any) => {  
        this.submitLoading = false

      if (res.isDone) {
        this.message.custom(res.message);
        this.userForm.reset();
        this._location.back()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.submitLoading = false
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
