import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { ChangePasswordReqDTO } from 'src/app/Core/Models/AuthDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
declare var $: any;


@Component({
  selector: 'prs-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  phone = '';
  isLoading = false;
  isCodeStep = false;

  codeFC = new FormControl('', Validators.required);
  passwordFC = new FormControl('', Validators.required);
  retypePasswordFC = new FormControl('', Validators.required);

  changePasswordReq!: ChangePasswordReqDTO;
  phoneNumber: string | null = '';

  constructor(public router: Router,
              public route: ActivatedRoute,
              public api: AuthApiService,
              public errorService: ErrorsService,
              public messageService: MessageService,
              public session: SessionService
  ) {
    // errorService.clear();
  }

  ngOnInit(): void {
    // @ts-ignore
    this.phone = this.route.snapshot.paramMap.get('phone')
  }

  setValue(): void {
    this.changePasswordReq = {
      password: this.passwordFC.value,
      phone: this.phone,
      code: this.codeFC.value
    };
  }

  changePassword(): void {
    if (this.passwordFC.value === this.retypePasswordFC.value) {
      this.isLoading = true;
      this.setValue();
      this.api.changePassword(this.changePasswordReq).subscribe((res: any) => {
        this.isLoading = false;
        if (res.isDone) {
          this.messageService.custom('گذرواژه شما با موفقیت تغییر یافت');
          this.router.navigateByUrl('/auth/validate');
        } else {
          this.messageService.custom(res.message);
        }
      }, (error: any) => {
        this.isLoading = false;
        this.errorService.recordError(error.error.data);
        this.errorService.check(error);
      });
    } else {
      this.messageService.custom('گذرواژه شما با تکرار آن مطابقت ندارد');
    }
  }

  togglePassword() {
    $(".icon-eye").toggleClass("icon-eye-off");
    var input = $("#togglePassword")
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }
  toggleRetypePassword() {
    $(".icon-eye").toggleClass("icon-eye-off");
    var input = $("#toggleRetypePassword")
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }
  getResult(event: any): void {
    this.isCodeStep = event;
  }

}
