import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingApiService } from 'src/app/Core/Https/setting-api.service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss']
})
export class CurrencyRatesComponent implements OnInit {

  euroRateFC = new FormControl('');
  dollarRateFC = new FormControl('');
  AEDRateFC = new FormControl('');

  objName = '';

  data: any;
  req: any;

  constructor(
    public settingApi: SettingApiService,
    public checkErrorService: CheckErrorService,
    public message: MessageService,
    public errorService: ErrorsService,
  ) {
  }

  ngOnInit() {
    this.getCurrencies();
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

  updateSetting() {
    this.setReq()
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
