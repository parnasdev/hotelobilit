import { Component, Inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthApiService } from "../../Core/Https/auth-api.service";
import { ErrorsService } from "../../Core/Services/errors.service";
import { PublicService } from "../../Core/Services/public.service";
import { SessionService } from "../../Core/Services/session.service";
import { MessageService } from "../../Core/Services/message.service";
import { LoginReqDTO, RegisterReqDTO, SendCodeReqDTO, ValidationResDTO } from 'src/app/Core/Models/AuthDTO';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'prs-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.scss']
})
export class ConfirmPhoneComponent implements OnInit {
  showBox = false;
  isLoading = false;
  step = 'login'

  authMode = 2    // 1= phone    2= code
  phoneNumberFC = new FormControl();
  codeFC = new FormControl();
  constructor(public router: Router,
    public api: AuthApiService,
    public dialogRef: MatDialogRef<ConfirmPhoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public errorService: ErrorsService,
    public publicService: PublicService,
    public checkError: CheckErrorService,
    public message: MessageService,
    public session: SessionService
  ) {
    errorService.clear();
    this.phoneNumberFC.setValue(this.data)

  }
  ngOnInit(): void {
    this.validate()
  }

  changeNumber() {
    this.authMode = 1;
  }

  validate(): void {
    this.isLoading = true;
    this.api.validate(this.publicService.fixNumbers(this.phoneNumberFC.value)).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.checkAuthMode(res.data);
        this.authMode = 2;
        this.step = res.data.step;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.errorService.check(error);
      this.errorService.recordError(error.error.data);
      this.isLoading = false;
    });
  }

  checkAuthMode(validateData: ValidationResDTO): void {
    const phoneNumber = this.publicService.fixNumbers(this.data)
    if (validateData.step === 'login') {
      this.sendSms(phoneNumber, 'tempPassword');
    } else {
      // register
      this.sendSms(phoneNumber, 'register');

    }
  }

  sendSms(phoneNumber: string, tokenType: string): void {
    let req: SendCodeReqDTO = {
      step: tokenType,
      username: phoneNumber
    }
    this.api.sendSms(req).subscribe((res: any) => {
      if (res.isDone) {
      } else {
        alert(res.message);
      }
    }, (error: any) => {
      this.errorService.check(error)
    });
  }

  register(): void {
    const inputCode = this.publicService.fixNumbers(this.codeFC.value);
    this.isLoading = true;
    let obj: RegisterReqDTO = {
      token: inputCode,
      username: this.data
    }
    this.api.register(obj).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setTokenToSession(res.data);
        this.dialogRef.close(true)
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.errorService.recordError(error.error.errors);
      debugger
      this.checkError.check(error);
    });
  }

  login(): void {
    const inputCode = this.publicService.fixNumbers(this.codeFC.value);

    this.isLoading = true;
    let obj: LoginReqDTO = {
      password: inputCode,
      temp: 1,
      username: this.data
    }
    this.api.login(obj).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.session.setTokenToSession(res.data);
        this.dialogRef.close(true)

      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = false;
      this.errorService.recordError(error.error.errors);
      debugger
      this.errorService.check(error);
    });
  }

  onCodeCompleted() {
    this.submit()
  }
  onCodeChanged(event: any) {
    this.codeFC.setValue(event);
  }

  submit() {
    if (this.step === 'login') {
      this.login()
    } else {
      this.register();
    }
  }
}
