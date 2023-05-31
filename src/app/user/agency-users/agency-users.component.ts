
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CheckErrorService} from "../../Core/Services/check-error.service";
import {CalenderServices} from "../../Core/Services/calender-service";
import {ErrorsService} from "../../Core/Services/errors.service";
import {MessageService} from "../../Core/Services/message.service";
import {UserApiService} from "../../Core/Https/user-api.service";
import {UserReqDTO, UserResDTO} from "../../Core/Models/UserDTO";
import {AlertDialogComponent, AlertDialogDTO} from "../../common-project/alert-dialog/alert-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { SessionService } from 'src/app/Core/Services/session.service';
declare var $: any;

@Component({
  selector: 'prs-agency-users',
  templateUrl: './agency-users.component.html',
  styleUrls: ['./agency-users.component.scss']
})
export class AgencyUsersComponent implements OnInit {
  paginate: any;
  p =1;
  paginateConfig: any;
  userReq: UserReqDTO = {
    paginate: true,
    perPage: 20,
  };
  userId:string | null = '';
  users: UserResDTO[] = [];
  isLoading = false;
  city = '';

  constructor(public userApi: UserApiService,
              public route: ActivatedRoute,
              public checkErrorService: CheckErrorService,
              public calService: CalenderServices,
              public dialog: MatDialog,
              public session: SessionService,
              public errorService: ErrorsService,
              public message: MessageService) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    $(document).ready(() => {
      $(".item:even").css('background', '#e6e6e6')
      $(".item:odd").css('background', '#f4f7fa')
    })
    this.getUsers();
  }

  getUsers(): void {
    this.isLoading = true;
    this.userApi.getUser(null,(this.userId ? +this.userId : 0)).subscribe((res: any) => {
      if (res.isDone) {
        this.users = res.data
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
      this.checkErrorService.check(error);
    });
  }


  onPageChanged(event: any) {
    this.p = event;
    this.getUsers();
  }

  deleteClicked(userId: number):void {
    const obj: AlertDialogDTO = {
      description: 'حذف شود؟',
      icon: 'null',
      title: 'اطمینان دارید'
    };
    const dialog = this.dialog.open(AlertDialogComponent, {
      width: '30%',
      data: obj
    });
    dialog.afterClosed().subscribe((result:any) => {
      if (result) {
        this.deleteUser(userId)
      }
    });
  }


  deleteUser(userId: number): void {
    this.isLoading = true;
    this.userApi.deleteUser(userId).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom('کاربر مورد نظر حذف شد');
        this.getUsers();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
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

}
