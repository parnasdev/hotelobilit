import {Component, Input, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthApiService} from "../../Core/Https/auth-api.service";
import {ErrorsService} from "../../Core/Services/errors.service";
import {PublicService} from "../../Core/Services/public.service";
import {SessionService} from "../../Core/Services/session.service";
import {MessageService} from "../../Core/Services/message.service";
import { ValidateResDTO } from 'src/app/Core/Models/AuthDTO';


declare var $: any;

@Component({
  selector: 'prs-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

  @Input() isForgetPassword = false;
  @Output() forgetPassword = new EventEmitter();
  @Input() phone = '';
  showBox = false;
  phoneNumberFC = new FormControl('', Validators.required);
  isLoading = false;

  constructor(public router: Router,
              public api: AuthApiService,
              public errorService: ErrorsService,
              public publicService: PublicService,
              public message: MessageService,
              public session: SessionService
  ) {
    errorService.clear();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.phone !== '') {
      this.phoneNumberFC.setValue(this.phone);
      $('#someTextBox').focus();
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
        if (this.isForgetPassword) {
          this.forgetPassword.emit(true);
        } else {
          if(tokenType == 'login') {
            this.router.navigate(['/auth/login/' + phoneNumber],{ queryParams: {temp: '1'}});
          } else {
            this.router.navigate(['/auth/register/' + phoneNumber],{ queryParams: {type: '3'}});
          }
        }
      } else {
        alert(res.message);
      }
    }, (error: any) => {
      this.errorService.check(error)
      // alert('مشکلی در سرور رخ داده است');
    });
  }

  checkAuthMode(validateData: ValidateResDTO): void { 
    const phoneNumber = this.publicService.fixNumbers(this.phoneNumberFC.value) 
    if (validateData.authMode === 1) {
      // login
      if (this.isForgetPassword) {
        this.sendSms(phoneNumber, 'forget');
      } else {
        if (validateData.password){
          this.router.navigateByUrl('/auth/login/' + phoneNumber);
        }else {
          this.sendSms(phoneNumber, 'login');
        }
      }
    } else {
      // register
      this.sendSms(phoneNumber, 'activation');
    }
  }

}
