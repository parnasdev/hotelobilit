import {Component, Input, OnInit, Inject, EventEmitter, SimpleChanges} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/Core/Https/auth-api.service';
import { LoginReqDTO, ValidateResDTO } from 'src/app/Core/Models/AuthDTO';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { SessionService } from 'src/app/Core/Services/session.service';

declare var $: any;

@Component({
  selector: 'prs-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.scss']
})
export class AuthPopupComponent implements OnInit {

  step = 'validate'
  actionType = 'register'
  registerReq!: LoginReqDTO;
  phoneNumberFC = new FormControl('', Validators.required);
  codeFC = new FormControl('');
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<AuthPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              public router: Router,
              public api: AuthApiService,
              public errorService: ErrorsService,
              public publicService: PublicService,
              public message: MessageService,
              public session: SessionService,
              
  ) {
    errorService.clear();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      // this.phoneNumberFC.setValue(this.phone);
      // $('#someTextBox').focus();
  }

  check(type: string): void {
    if (type == 'validate'){
      this.validate();
    } else {
      const inputCode = this.publicService.fixNumbers(this.codeFC.value);
      this.registerReq = {
        phone: this.publicService.fixNumbers(this.phoneNumberFC.value),
        password: inputCode,
        accountType: 'user',
        temp: 1
      };
      if(this.actionType === 'register') {
        this.register();
      } else {
        this.login();
      }
    }
  }

  validate(): void {
    this.isLoading = true;
    this.api.validate(this.publicService.fixNumbers(this.phoneNumberFC.value)).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.checkAuthMode(res.data);
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.errorService.check(error);
      this.errorService.recordError(error.error.data);
      this.isLoading = false;
    });
  }

  sendSms(phoneNumber: string, tokenType: string): void {
    this.api.sendSms(phoneNumber, tokenType).subscribe((res: any) => {
      if (res.isDone) {
        this.step = 'login'
        this.actionType = tokenType === 'activation' ? 'register' : 'login'
      } else {
        alert(res.message);
      }
    }, (error: any) => {
      this.errorService.check(error)
    });
  }

  checkAuthMode(validateData: ValidateResDTO): void {
    if (validateData.authMode === 1) {
      this.sendSms(this.publicService.fixNumbers(this.phoneNumberFC.value), 'login');
    } else {
      // register
      this.sendSms(this.publicService.fixNumbers(this.phoneNumberFC.value), 'activation');
    }
  }

  login(): void {
    this.isLoading = true;
    this.api.login(this.registerReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        this.dialogRef.close(true)
        // if (this.session.getRole() === 'User') {
        //   this.router.navigateByUrl('/dashboard');
        // } else if (this.session.getRole() === 'Admin' || this.session.getRole() === 'Staff') {
        //   this.router.navigateByUrl('/panel');
        // } else {
        //   this.router.navigateByUrl('/');
        // }

      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.errorService.recordError(error.error.data);
      this.errorService.check(error);
    });
  }

  register(): void {
    this.isLoading = true;
    this.api.register(this.registerReq).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setUserToSession(res.data);
        this.dialogRef.close()
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.errorService.recordError(error.error.data);
      this.errorService.check(error);
    });
  }

  changeStep() {
    this.step = 'validate'
  }

}
