import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { ConvertRequestDTO, LoginReqDTO } from 'src/app/Core/Models/AuthDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';
@Component({
  selector: 'prs-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.scss']
})
export class AdminAuthComponent implements OnInit {

  isLoading = false;
  accountType = 3;
  phoneFC = new FormControl('', Validators.required);
  loginReq: LoginReqDTO = {
    phone: '',
    password: '',
    accountType: '',
  };
  passwordFC = new FormControl('', Validators.required);
  phoneNumber: string | null = '';

  temp = 0;
  constructor(public router: Router,
    public route: ActivatedRoute,
    public api: AuthApiService,
    public errorService: ErrorsService,
    public messageService: MessageService,
    public session: SessionService
  ) {

  }

  ngOnInit(): void {
  }

  submit(): void {
    this.loginReq = {
      phone: this.phoneFC.value,
      password: this.passwordFC.value,
      temp: 0,
      accountType: 'Admin',
    };
    this.login();
  }

  login(): void {
    this.isLoading = true;
    this.api.login(this.loginReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        if (this.session.getRole() === 'Admin') {
          this.router.navigateByUrl('/panel');
        }

      } else {
        this.messageService.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.errorService.recordError(error.error.data);
      this.errorService.check(error);
    });
  }


}
