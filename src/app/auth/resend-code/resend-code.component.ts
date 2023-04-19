import {Component, Input, OnInit} from '@angular/core';
import {AuthApiService} from "../../Core/Https/auth-api.service";
import {ErrorsService} from "../../Core/Services/errors.service";
import {MessageService} from "../../Core/Services/message.service";


@Component({
  selector: 'prs-resend-code',
  templateUrl: './resend-code.component.html',
  styleUrls: ['./resend-code.component.scss']
})
export class ResendCodeComponent implements OnInit {

  @Input() phone = '';
  @Input() type = 'activation';
  @Input() call = false;

  buttonSelected = true;
  interval: any;
  seconds = 0;
  minutes = 2;

  constructor(public api: AuthApiService,
              public errorService: ErrorsService,
              public message: MessageService) {
  }

  ngOnInit(): void {
    this.startTimer();
    if (this.call) {
      this.sendSms(this.phone)
    }
  }

  startTimer() {
    this.buttonSelected = true;
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.seconds = 59;
        this.minutes--;
      } else {
        this.buttonSelected = false;
        clearInterval(this.interval);
        this.minutes = 2;
      }
    }, 1000);
  }

  formatter(n: number) {
    return n > 9 ? '' + n : '0' + n;
  }

  resendValidationMessage() {
    this.startTimer();
    this.sendSms(this.phone);
  }

  sendSms(phoneNumber: string): void {
    this.api.sendSms(phoneNumber,this.type).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom('کد با موفقیت ارسال شد');
      } else {
        this.message.custom('مشکلی رخ داده است');
      }
    }, (error: any) => {
      this.errorService.check(error)
      this.message.custom('ارسال پیام با مشکلی مواجه شده است');
    });
  }

}
