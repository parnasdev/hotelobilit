import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { CommonApiService } from 'src/app/Core/Https/common-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotelApiService } from 'src/app/Core/Https/hotel-api.service';
import { PackageTourDTO, TourSetDTO } from 'src/app/Core/Models/tourDTO';
import { CityListReq, CityListRes } from 'src/app/Core/Models/newCityDTO';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import * as moment from 'moment';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { TransferRateListDTO } from 'src/app/Core/Models/transferRateDTO';
import { PricingPopupComponent } from 'src/app/hotel/panel/pricing-popup/pricing-popup.component';
import { SetPricePopupComponent } from 'src/app/room/set-price-popup/set-price-popup.component';
import { RoomTypeSetDTO } from 'src/app/Core/Models/roomTypeDTO';


@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  minDate = new Date()
  cities: categoriesDTO[] | CityListRes[] = []
  transferRates: TransferRateListDTO[] = [];
  packages: PackageTourDTO[] = [];
  hotels: any[] = [];

  flights: number[] = []
  req: TourSetDTO = {
    title: '',
    origin_id: 0,
    destination_id: 0,
    night_num: 0,
    day_num: 0,
    tour_type: 0,
    checkin: '',
    checkout: '',
    expired_at: '',
    status_id: 0,
    flights: [],
    packages: []
  }
  titleFC = new FormControl('', [Validators.required])
  origin_idFC = new FormControl('', [Validators.required])
  destination_idFC = new FormControl('', [Validators.required])
  night_numFC = new FormControl('', [Validators.required])
  day_numFC = new FormControl('', [Validators.required])
  tour_typeFC = new FormControl(false, [Validators.required])
  checkinFC = new FormControl('', [Validators.required])
  checkoutFC = new FormControl('', [Validators.required])
  expired_atFC = new FormControl('', [Validators.required])
  status_idFC = new FormControl('', [Validators.required])
  constructor(
    public cityApi: CityApiService,
    public commonApi: CommonApiService,
    public session: SessionService,
    public hotelApi: HotelApiService,
    public checkError: CheckErrorService,
    public transferTypeApi: TransferRateAPIService,
    public message: MessageService,
    public calenderService: CalenderServices,
    public router: Router,
    public route: ActivatedRoute,
    public errorService: ErrorsService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public tourApi: TourApiService) {
  }

  ngOnInit() {
    this.getCities();
  }

  getCities(): void {
    const req: CityListReq = {
      hasHotel: 0,
      hasFlight: 0,
    }
    this.cityApi.getCities(req).subscribe((res: any) => {
      if (res.isDone) {
        this.cities = res.data;

      }
    }, (error: any) => {
      this.message.error()

    })
  }

  setReq() {
    this.req = {
      title: this.titleFC.value ?? '',
      origin_id: +(this.origin_idFC.value ?? ''),
      destination_id: +(this.destination_idFC.value ?? ''),
      night_num: +(this.night_numFC.value ?? ''),
      day_num: +(this.day_numFC.value ?? ''),
      tour_type: +(this.tour_typeFC.value ?? ''),
      checkin: this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : '',
      checkout: this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : '',
      expired_at: this.expired_atFC.value ? moment(this.expired_atFC.value).format('YYYY-MM-DD') : '',
      status_id: +(this.status_idFC.value ?? ''),
      flights: this.flights,
      packages: this.packages
    }
  }


  addHotel() {
    let item: PackageTourDTO = {
      hotel_id: 0,
      order_item: 0,
      offered: false
    };
    this.packages.push(item);
  }

  removePackage(index: number) {
    this.packages.splice(index, 1);
  }




  getHotels(): void {
    if (this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        "destination_id": this.destination_idFC.value,
        "checkin": this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        "checkout": this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.tourApi.gethotels(req).subscribe((res: any) => {
        if (res.isDone) {
          this.hotels = res.data;
          this.addHotel();
        } else {
          this.message.custom(res.message);
        }
      }, (error: any) => {
        // this.message.error()
      })
    }
  }

  getTransferRates(): void {
    if (this.origin_idFC.valid && this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        origin_id: this.origin_idFC.value,
        destination_id: this.destination_idFC.value,
        checkin: this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        checkout: this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.tourApi.getFlights(req).subscribe((res: any) => {
        if (res.isDone) {
          this.transferRates = res.data;
        } else {
          this.message.custom(res.message);
        }
      }, (error: any) => {
        // this.message.error()
      })
    }
  }

  submit(): void {
    this.setReq()
    this.tourApi.createTour(this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.errorService.clear();
        this.router.navigateByUrl('/panel/packages');
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.data);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })
  }


  dateChanged() {
    let dates = this.calenderService.enumerateDaysBetweenDates(this.checkinFC.value ?? '', this.checkoutFC.value ?? '')
    if (dates.length > 0) {
      this.night_numFC.setValue((dates.length - 1).toString())
      this.day_numFC.setValue(dates.length.toString())
    }
    this.getTransferRates();
    this.getHotels()


  }


  changeTransferRates() {
    this.flights = [];
    this.transferRates.forEach(x => {
      if (x.isChecked) {
        this.flights.push(x.id);
      }
    })
  }


  getEndCity(cityItemSelected: any): void {
    this.destination_idFC.setValue(cityItemSelected.id);
    this.getTransferRates();
    this.getHotels()

  }

  getStCity(cityItemSelected: any): void {
    this.origin_idFC.setValue(cityItemSelected.id);
    this.getTransferRates();


  }

  openPricingCalendar(index: number, hotelId: number) {
    const hotelFiltered = this.hotels.filter(x => x.id === +hotelId);
    const hotel = hotelFiltered.length > 0 ? hotelFiltered[0] : null
    if (hotelId === 0 || !hotelId) {
      this.message.custom('لطفا هتل خود را انتخاب کنید')
    } else {
      const dialog = this.dialog.open(PricingPopupComponent, {
        width: '100%',
        height: '100%',
        data: {
          hotelId: hotelId,
          slug: hotel.slug,
        }
      });
      dialog.afterClosed().subscribe((result) => {

        // this.setService.getHotelRates(hotelId, index);
      })
    }
  }

}
