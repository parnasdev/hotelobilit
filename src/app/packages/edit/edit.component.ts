import { Component, OnInit } from '@angular/core';
import { AddComponent } from '../add/add.component';
import { CityListReq } from 'src/app/Core/Models/newCityDTO';
import * as moment from 'moment';
import { PackageTourDTO } from 'src/app/Core/Models/tourDTO';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {
  tourData: any;
  id = ''

  override ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? ''
    this.getCities();
  }

  getInfo(): void {
    this.isLoading = true;
    this.tourApi.getTourInfo(+this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.tourData = res.data.tour;
        this.statuses = res.data.statuses;
        this.setInfo();
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;

    }, (error: any) => {
      // this.message.error()
      this.isLoading = false;

    })
  }


  override getHotels(): void {
    if (this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      this.isLoading = true;
      const req = {
        "destination_id": this.destination_idFC.value,
        "checkin": this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        "checkout": this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.tourApi.gethotels(req).subscribe((res: any) => {
        if (res.isDone) {
          this.hotels = res.data;

          this.convertPackages();
        } else {
          this.message.custom(res.message);
        }
        this.isLoading = false;

      }, (error: any) => {
        this.isLoading = false;
        // this.message.error()
      })
    }
  }


  convertPackages() {
    this.packages = [];
    this.tourData.packages.forEach((x: any) => {
      let item: PackageTourDTO = {
        hotel_id: x.hotel.id,
        order_item: x.order_item,
        id: x.id,
        offered: x.offered,
      }
      this.packages.push(item)
    })
  }

  override getTransferRates(): void {
    if (this.origin_idFC.valid && this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        origin_id: this.origin_idFC.value,
        destination_id: this.destination_idFC.value,
        checkin: this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        checkout: this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.isLoading = true;

      this.tourApi.getFlights(req).subscribe((res: any) => {
        if (res.isDone) {
          this.transferRates = res.data;
          this.transferRates.forEach(x => {
            this.tourData.flightIs.forEach((y: any) => {
              if (x.id == y) {
                x.isChecked = true
              }
            })
          })
        } else {
          this.message.custom(res.message);
        }
        this.isLoading = false;

      }, (error: any) => {
        // this.message.error()
        this.isLoading = false;

      })
    }
  }

  override getCities(): void {
    this.isLoading = true;
    const req: CityListReq = {
      hasHotel: 0,
      hasFlight: 0,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      if (res.isDone) {
        this.cities = res.data;
        this.getInfo()

      }
      this.isLoading = false;

    }, (error: any) => {
      this.message.error()
      this.isLoading = false;

    })
  }



  override submit(): void {
    this.setReq()
    this.tourApi.update(+this.id, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.errorService.clear();
        this.router.navigateByUrl('/panel/packages');
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.errors);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })
  }


  setInfo() {
    this.titleFC.setValue(this.tourData.title);
    this.origin_idFC.setValue(this.tourData.origin_id);
    this.destination_idFC.setValue(this.tourData.destination_id);
    this.night_numFC.setValue(this.tourData.night_num);
    this.day_numFC.setValue(this.tourData.day_num);
    this.tour_typeFC.setValue(!this.tourData.tour_type);
    this.checkinFC.setValue(this.tourData.checkin);
    this.checkoutFC.setValue(this.tourData.checkout);
    this.status_idFC.setValue(this.checkStatus(this.tourData.status.label));
    this.expired_atFC.setValue(this.tourData.expired_at);
    this.onTitleGenerator(this.tourData.origin_name ??'' , this.tourData.destination_name);
    this.flights = this.tourData.flightIs;
    // this.packages = this.tourData.packages
    this.getTransferRates();
    this.getHotels();
  }

  checkStatus(name: string){
    return this.statuses.find(x => x.name === name)?.id ?? 0
  }


}
