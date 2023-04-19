import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { LoginReqDTO } from 'src/app/Core/Models/AuthDTO';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import {Location} from '@angular/common';

@Component({
  selector: 'prs-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  registerReq!: LoginReqDTO;
  codeFC = new FormControl('');
  phone = ''
  accountType:string = '3';
  constructor(public route: ActivatedRoute,
    public router: Router,
    public api: AuthApiService,
    public publicService: PublicService,
    private _location: Location,
    public messageService: MessageService,
    public checkError: ErrorsService,
    public session: SessionService
  ) {
    checkError.clear();
    this.route.queryParams.subscribe(params => {
      this.accountType = params['type'];
    })
  }

  ngOnInit(): void {
    // @ts-ignore
    this.phone = this.route.snapshot.paramMap.get('phoneNumber');
  }

  getCodeValues(): void {
    const inputCode = this.publicService.fixNumbers(this.codeFC.value);
    this.registerReq = {
      phone: this.phone,
      password: inputCode,
      accountType: this.getAccountTypeLabel()
    };
    this.register();
  }

  getAccountTypeLabel(): string {
    switch (this.accountType) {
      case '2':
        return 'staff';
      case '4':
        return 'agency';
      case '1':
        return 'admin'
      default:
        return 'user'
    }
  }

  register(): void {
    this.isLoading = true;
    this.api.register(this.registerReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        if (this.accountType === '4'){
          this.router.navigateByUrl('/panel/profile');
        } else {
          this.router.navigateByUrl('/dashboard/user/profile');
        }
      } else {
        this.messageService.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.checkError.recordError(error.error.data);
      this.checkError.check(error);
    });
  }

  backClicked() {
    this._location.back();
  }

}
