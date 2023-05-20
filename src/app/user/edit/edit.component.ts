import {Component, OnInit} from '@angular/core';
import {PermissionDTO, UserCreateReq, UserReqDTO, UserResDTO, UserRolesDTO} from "../../Core/Models/UserDTO";
import {FormBuilder, FormControl} from "@angular/forms";
import {CheckErrorService} from "../../Core/Services/check-error.service";
import {ErrorsService} from "../../Core/Services/errors.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonApiService} from "../../Core/Https/common-api.service";
import {SessionService} from "../../Core/Services/session.service";
import {CalenderServices} from "../../Core/Services/calender-service";
import {PublicService} from "../../Core/Services/public.service";
import {ResponsiveService} from "../../Core/Services/responsive.service";
import {MessageService} from "../../Core/Services/message.service";
import {UserApiService} from "../../Core/Https/user-api.service";

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userId = '';
  userInfo: any;
  roles: {id: number;label: string}[] = [];
  userReq: UserCreateReq = {
    name: '',
    family: '',
    username: '',
    phone: '',
    password: '',
    role_id: 1,
    hotels: []
  }
  hotels: any[] = []; 
  selectedhotelsFC = new FormControl('');
  userForm = this.fb.group({
    name: new FormControl(''),
    family: new FormControl(''),
    username: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    role_id: new FormControl()
  });

  role: string = '';

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
}
  ngOnInit(): void {
    // @ts-ignore
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getUser();
    this.role = this.session.getRole()
  }

  getUser(): void {
    this.api.getEditData(+this.userId).subscribe((res: any) => {
      if (res.isDone) {
        this.userInfo = res.data;
        this.roles = res.data.roles;
        console.log(this.roles)
        this.hotels = res.data.hotels;
        this.fillForm();
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  fillForm(): void {
    this.userForm.controls.name.setValue(this.userInfo.user.name);
    this.userForm.controls.family.setValue(this.userInfo.user.family);
    this.userForm.controls.phone.setValue(this.userInfo.user.phone);
    this.userForm.controls.username.setValue(this.userInfo.user.username);
    this.userForm.controls.role_id.setValue(this.userInfo.user.role_id);
    this.selectedhotelsFC.setValue(this.userInfo.hotelIds)

  }
  setReq() {
    this.userReq = {
      name: this.userForm.value.name ?? '',
      family: this.userForm.value.family??'',
      phone: this.userForm.value.phone ?? '',
      edit_mode: this.userForm.value.password !== '' ? 'password' :'profile',
      password: this.userForm.value.password ?? '',
      username: this.userForm.value.username ?? '',
      role_id: this.userForm.value.role_id ?? 0,
      hotels: this.selectedhotelsFC.value
    };
  }



   submit() {
    this.setReq();
    this.api.editUser(this.userReq, this.userId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.router.navigate(['/panel/user']);
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
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
