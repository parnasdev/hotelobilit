import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleApiService } from 'src/app/Core/Https/role-api.service';
import { RoleListResDTO } from 'src/app/Core/Models/newRoleDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { AlertDialogComponent, AlertDialogDTO } from 'src/app/common-project/alert-dialog/alert-dialog.component';

@Component({
  selector: 'prs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  req!: any;
  roles: RoleListResDTO[] = [];
  p = 1
  paginate: any;
  paginateConfig: any;
  isLoading = false;
  constructor(public api: RoleApiService,
    public session: SessionService,
    public checkError: CheckErrorService,
    public calService: CalenderServices,
    public dialog: MatDialog,
    public message: MessageService) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.setReq();
    this.isLoading = true;
    this.api.getRoles(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.roles = res.data
        this.paginate = res.meta;
        this.paginateConfig = {
          itemsPerPage: this.paginate.per_page,
          totalItems: this.paginate.total,
          currentPage: this.paginate.current_page
        }
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkError.check(error);
    });
  }

  setReq(): void {
    this.req = {
      paginate: true,
      perPage: 10,
      keyword: '',
    }
  }
  deleteClicked(roleId: number): void {
    const obj: AlertDialogDTO = {
      description: 'حذف شود؟',
      icon: 'null',
      title: 'اطمینان دارید'
    };
    const dialog = this.dialog.open(AlertDialogComponent, {
      width: '30%',
      data: obj
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteRole(roleId)
        this.getRoles();
      }
    });
  }


  deleteRole(roleId: number): void {
    this.isLoading = true;
    this.api.deleteRole(roleId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom('نقش مورد نظر حذف شد');
        this.getRoles();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkError.check(error);
    });
  }

  getRoleFa(role: string) {
    switch (role) {
      case 'Admin':
        return 'ادمین'
      case 'Staff':
        return 'کارمند'
      case 'User':
        return 'کاربر'
      default:
        return '-'
    }
  }


  checkItemPermission(item: string) {
    return !!this.session.userPermissions.find((x: any) => x.name === item)
  }

  onPageChanged(event: any) {
    this.p = event;
    this.getRoles();
  }
}
