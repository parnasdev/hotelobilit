import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { ConvertRequestDTO, LoginReqDTO } from 'src/app/Core/Models/AuthDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';

@Component({
  selector: 'prs-agency-login',
  templateUrl: './agency-login.component.html',
  styleUrls: ['./agency-login.component.scss']
})
export class AgencyLoginComponent implements OnInit {

  convertData!: ConvertRequestDTO;

  isLoading = false;
  registerReq!: LoginReqDTO;
  codeFC = new FormControl('');
  phone = ''
  accountType:string = 'user';
  temp = 0;
  constructor(public route: ActivatedRoute,
    public router: Router,
    public api: AuthApiService,
    public publicService: PublicService,
    public messageService: MessageService,
    public checkError: ErrorsService,
    public session: SessionService
  ) {
    checkError.clear();
    this.route.queryParams.subscribe(params => {
      this.accountType = params['type'];
      this.temp = params['temp'];
    })
  }

  ngOnInit(): void {
    // @ts-ignore
    this.phone = this.route.snapshot.paramMap.get('phoneNumber');
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
  
  setConvertData(){
    this.convertData = {
      phone: this.phone,
      password: this.codeFC.value
    }
  }

  convertUserToAgency(): void {
    this.isLoading = true;
    this.setConvertData();
    this.api.convertUserToAgency(this.convertData).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
          this.router.navigateByUrl('/panel/profile');
        } else {
        this.messageService.custom(res.message);
      }
    }, (error: any) => {
      this.checkError.check(error);
      this.checkError.recordError(error.error.data);
      this.isLoading = false;
    });
  }

  login(): void {
    this.isLoading = true;
    this.api.login(this.registerReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        this.router.navigateByUrl('/panel/profile');
      } else {
        this.messageService.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.checkError.recordError(error.error.data);
      this.checkError.check(error);
    });
  }

  getCodeValues(): void {
    const inputCode = this.publicService.fixNumbers(this.codeFC.value);
    if (this.accountType === 'user') {
      this.convertUserToAgency();
    } else {
      this.registerReq = {
        phone: this.phone,
        password: inputCode,
        accountType: this.accountType,
        temp: this.temp
      };
      this.login();
    }
  }

}
