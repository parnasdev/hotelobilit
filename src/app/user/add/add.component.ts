import { Component, OnInit } from '@angular/core';
import { PermissionDTO, UserCreateReq, UserReqDTO, UserRolesDTO } from "../../Core/Models/UserDTO";
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

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  //public Variable
  isMobile: any;
  isLoading = false;
  roles: { id: number; label: string }[] = [];
  hotels: any[] = [];
  selectedhotelsFC = new FormControl();
  selectedCity = new FormControl();
  filteredHotel: any[] = [];

  cities: { id: number, name: string }[] = [];
  userReq: UserCreateReq = {
    name: '',
    family: '',
    username: '',
    phone: '',
    password: '',
    role_id: 1,
    hotels: []
  }
  setPermissions: string[] = [];
  constructor(public fb: FormBuilder,
    public api: UserApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calService: CalenderServices,
    public errorService: ErrorsService,
    public message: MessageService,
    public checkError: CheckErrorService,
    public router: Router,
    public commonApi: CommonApiService,
    public session: SessionService,
    public calenderServices: CalenderServices,
    public mobileService: ResponsiveService,
    public publicServices: PublicService) {
    this.isMobile = mobileService.isMobile();
  }

  userForm = this.fb.group({
    name: new FormControl(''),
    family: new FormControl(''),
    username: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    role_id: new FormControl(2)
  });

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.api.getCreateData().subscribe((res: any) => {
      if (res.isDone) {
        this.roles = res.data.roles;
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


  setReq() {
    this.userReq = {
      name: this.userForm.value.name ?? '',
      family: this.userForm.value.family ?? '',
      phone: this.userForm.value.phone ?? '',
      password: this.userForm.value.password ?? '',
      username: this.userForm.value.username ?? '',
      role_id: this.userForm.value.role_id ?? 0,
      hotels: this.selectedhotelsFC.value
    };
  }

  submit() {
    this.setReq();
    this.api.createUser(this.userReq).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.userForm.reset();
        this.router.navigate(['/panel/user']);
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
        this.markFormGroupTouched(this.userForm);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  getHotelName(id: number) {
    return this.hotels.find((y: any) => y.id === id)?.name
  }

}
