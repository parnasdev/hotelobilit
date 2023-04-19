import {Component, Input, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { ConvertRequestDTO, ValidateResDTO } from 'src/app/Core/Models/AuthDTO';

import { ValidateComponent } from '../validate/validate.component';
declare var $: any;
@Component({
  selector: 'prs-agency-validate',
  templateUrl: './agency-validate.component.html',
  styleUrls: ['./agency-validate.component.scss']
})
export class AgencyValidateComponent extends ValidateComponent implements OnInit {

  accountType = 'user'

  override sendSms(phoneNumber: string, tokenType: string): void {
    this.api.sendSms(phoneNumber, tokenType).subscribe((res: any) => {
      if (res.isDone) {
        if (this.isForgetPassword) {
          this.forgetPassword.emit(true);
        } else {
          if(tokenType == 'activation'){
            this.router.navigate(['/auth/register/' + phoneNumber],{ queryParams: {type: '4'}});
          } else {
            this.router.navigate(['auth/partner/login/' + phoneNumber],{ queryParams: {temp: '1', type: this.accountType}});
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

  checkSubmit(flag: boolean) {
    if (flag) {
      this.sendSms(this.publicService.fixNumbers(this.phoneNumberFC.value), 'login');
    } else {
      this.showBox = false;
    }
  }

  override checkAuthMode(validateData: ValidateResDTO): void {
    const phoneNumber = this.publicService.fixNumbers(this.phoneNumberFC.value) 
    this.accountType = validateData.accountType;
    if (validateData.authMode === 1) {
      // login
      if (this.isForgetPassword) {
        this.sendSms(phoneNumber, 'forget');
      } else {
        if(validateData.accountType == 'user') {
          this.showBox = true;
        } else {
          this.sendSms(phoneNumber, 'login');
        }
      }
    } else {
      // register
      this.sendSms(phoneNumber, 'activation');
    }
  }
}
