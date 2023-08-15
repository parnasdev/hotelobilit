import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingApiService } from 'src/app/Core/Https/setting-api.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'prs-service-rates',
  templateUrl: './service-rates.component.html',
  styleUrls: ['./service-rates.component.scss']
})
export class ServiceRatesComponent implements OnInit {

  insuranceRate = new FormControl('');
  transferRateFC = new FormControl('');
  visaRateFC = new FormControl('');

  objName = '';

  data: any;
  req: any;

  constructor(
    public settingApi: SettingApiService,
    public message: MessageService,
    public title: Title,
    public errorService: ErrorsService,) {
  }

  ngOnInit() {
    this.title.setTitle('نرخ گذاری ارز | هتل و بلیط')

    this.getServices();
  }

  getServices() {
    this.settingApi.getServices().subscribe((res: any) => {
      if (res.isDone) {
        this.data = { [res.data.name]: res.data.value }
        this.setData(res.data.name);
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
    })
  }

  setData(name: string){
    this.objName = name;
    this.insuranceRate.setValue(this.data[`${name}`].insurance_rate);
    this.transferRateFC.setValue(this.data[`${name}`].transfer_rate);
    this.visaRateFC.setValue(this.data[`${name}`].visa_rate);
  }

  setReq(){
    this.req = {
      [this.objName]: {
        'insurance_rate': this.insuranceRate.value ? +this.insuranceRate.value : 0 ,
        'transfer_rate': this.transferRateFC.value ? +this.transferRateFC.value: 0 ,
        'visa_rate': this.visaRateFC.value ? +this.visaRateFC.value : 0,
      }
    }
  }

  updateSetting(){
    this.setReq()
    this.settingApi.changeSetting(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        // this.router.navigateByUrl('panel/hotel')
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
    })
  }

}
