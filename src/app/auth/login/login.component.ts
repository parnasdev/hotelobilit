import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { LoginReqDTO } from 'src/app/Core/Models/AuthDTO';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
// import { LoginReqDTO } from 'src/app/Core/Models/authDTO';


declare var $: any;

@Component({
  selector: 'prs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  accountType = 3;
  passwordFC = new FormControl('', Validators.required);
  registerReq!: LoginReqDTO;
  phoneNumber: string | null = '';

  temp = 0;

  constructor(public router: Router,
    public route: ActivatedRoute,
    public api: AuthApiService,
    public errorService: ErrorsService,
    public messageService: MessageService,
    public session: SessionService
  ) {
    // errorService.clear();
    this.route.queryParams.subscribe(params => {
      this.accountType = params['account'];
      this.temp = +params['temp'];
    })
  }

  ngOnInit(): void {
    this.phoneNumber = this.route.snapshot.paramMap.get('phoneNumber');
  }

  submit(): void {
    this.registerReq = {
      phone: this.phoneNumber,
      password: this.passwordFC.value,
      temp: this.temp
    };
    this.login();
  }

  login(): void {
    this.isLoading = true;
    this.api.login(this.registerReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        if (this.session.getRole() === 'User') {
          this.router.navigateByUrl('/dashboard');
        } else if (this.session.getRole() === 'Admin' || this.session.getRole() === 'Staff') {
          this.router.navigateByUrl('/panel');
        } else {
          this.router.navigateByUrl('/');
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

  togglePassword() {
    $(".icon-eye").toggleClass("icon-eye-off");
    var input = $("#togglePassword")
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }

}
