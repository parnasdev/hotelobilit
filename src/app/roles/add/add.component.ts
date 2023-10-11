import { Component, OnInit } from '@angular/core';
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
import { RoleStoreReqDTO, permissionDTO } from 'src/app/Core/Models/newRoleDTO';
import { RoleApiService } from 'src/app/Core/Https/role-api.service';

@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  //public Variable
  isMobile: any;
  isLoading = false;
  roles: any[] = [];
  permissionsFC = new FormControl([]);
  permissions: permissionDTO[] = [];
  errors: any

  roleReq: RoleStoreReqDTO = {
    name: '',
    label: '',
    is_access_panel: 0,
    is_access_dashboard: 0,
    is_custom: 0,
    see_all_post: 0,
    custom_route_name_access: 0,
    permissions: []
  }

  constructor(public fb: FormBuilder,
    public api: RoleApiService,
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

  roleForm = this.fb.group({
    name: new FormControl(''),
    label: new FormControl(''),
    is_access_panel: new FormControl(),
    is_access_dashboard: new FormControl(),
    is_custom: new FormControl(0),
    see_all_post: new FormControl(),
    custom_route_name_access: new FormControl(),
  });

  ngOnInit(): void {
    this.getData();
  }

  return(){
    this.router.navigate([`/panel/roles`])
  }
  getData() {
    this.api.createRoles().subscribe((res: any) => {
      if (res.isDone) {
        this.permissions = res.data.permissions
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error();
      this.checkErrorService.check(error);
    });
  }


  markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  setReq() {
    this.roleReq = {
      name: this.roleForm.value.name ?? '',
      label: this.roleForm.value.label ?? '',
      is_access_panel: this.roleForm.value.is_access_panel ?? 0,
      is_access_dashboard:this.roleForm.value.is_access_dashboard ?? 0,
      is_custom: this.roleForm.value.is_custom ?? 0,
      see_all_post: this.roleForm.value.see_all_post ?? 0,
      custom_route_name_access: this.roleForm.value.custom_route_name_access ?? '',
      permissions: this.permissionsFC.value ?? []
    };
  }



  submit() {
    this.setReq();
    this.api.storeRole(this.roleReq).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.roleForm.reset();
        this.router.navigateByUrl('panel/roles')
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.errors);
        this.errors = Object.values(error.error.errors)

        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.message.error();
      this.checkErrorService.check(error);
    });
  }

  getPermission(item: number){
    return this.permissions.find(x => x.id === item)?.label;
  }
}
