import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingApiService } from 'src/app/Core/Https/setting-api.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'prs-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss']
})
export class CurrencyRatesComponent implements OnInit {

  euroRateFC = new FormControl('');
  dollarRateFC = new FormControl('');
  AEDRateFC = new FormControl('');
  adminCurrencies: any;
  objName = '';

  data: any;
  req: any;

  constructor(
    public title: Title,
    public settingApi: SettingApiService,
    public checkErrorService: CheckErrorService,
    public message: MessageService,
    public session: SessionService,
    public errorService: ErrorsService,
  ) {
  }

  ngOnInit() {
    this.title.setTitle('نرخ گذاری ارز | هتل و بلیط')
    if (this.session.getRole() === 'admin' || this.session.getRole() === 'programmer' || this.session.getRole() === 'hamnavazAdmin') {
      this.getAdminCurrencies()
    } else {
      this.getCurrencies();
    }


  }

  getCurrencies() {
    this.settingApi.getCurrencies().subscribe((res: any) => {
      if (res.isDone) {
        this.data = { [res.data.name]: res.data.value }
        this.setData(res.data.name);
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkErrorService.check(error);

    })
  }


  getAdminCurrencies() {
    let req = {
      "names": ["currencies"]
    }
    this.settingApi.getSetting(req).subscribe((res: any) => {
      if (res.isDone) {
        this.adminCurrencies = res.data.currencies;
        this.setAdminData();
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  setAdminData() {
    this.euroRateFC.setValue(this.adminCurrencies.euro);
    this.dollarRateFC.setValue(this.adminCurrencies.dollar);
    this.AEDRateFC.setValue(this.adminCurrencies.derham);
  }

  setData(name: string) {
    this.objName = name;
    this.euroRateFC.setValue(this.data[`${name}`].euro);
    this.dollarRateFC.setValue(this.data[`${name}`].dollar);
    this.AEDRateFC.setValue(this.data[`${name}`].derham);
  }

  setReq() {
    this.req = {
      [this.objName]: {
        'toman': 1,
        'euro': this.euroRateFC.value ? +this.euroRateFC.value : 0,
        'dollar': this.dollarRateFC.value ? +this.dollarRateFC.value : 0,
        'derham': this.AEDRateFC.value ? +this.AEDRateFC.value : 0,
      }
    }
  }

  setAdminReq() {
    this.req = {
      currencies: {
        'toman': 1,
        'euro': this.euroRateFC.value ? +this.euroRateFC.value : 0,
        'dollar': this.dollarRateFC.value ? +this.dollarRateFC.value : 0,
        'derham': this.AEDRateFC.value ? +this.AEDRateFC.value : 0,
      }
    }
  }

  updateAdminSetting() {
    this.setAdminReq()
    if(+this.req.currencies.euro<50000 || +this.req.currencies.dollar<50000){
      this.message.showMessageBig('نرخ ها نباید کمتر از  ۵۰,۰۰۰ باشد')
    }else{
      this.settingApi.changeSetting(this.req).subscribe((res: any) => {
        if (res.isDone) {
          this.message.showMessageBig(res.message);
          // this.router.navigateByUrl('panel/hotel')
        } else {
          this.message.custom(res.message)
        }
      }, (error: any) => {
        this.checkErrorService.check(error);
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      })
    }

  }

  submit() {


    if (this.session.getRole() === 'admin' || this.session.getRole() === 'programmer'|| this.session.getRole() === 'hamnavazAdmin') {
      this.updateAdminSetting()
    } else {
      this.updateSetting()
    }
  }

  updateSetting() {
    this.setReq()

    if(+this.req.currencies.euro<50000 || +this.req.currencies.dollar<50000){
      this.message.showMessageBig('نرخ ها نباید کمتر از  ۵۰,۰۰۰ باشد')
    }else{
    this.settingApi.changeSetting(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        // this.router.navigateByUrl('panel/hotel')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.checkErrorService.check(error);

      this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
    })
      }
  }

}
