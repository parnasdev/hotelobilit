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
import { categoriesDTO, statusesDTO } from 'src/app/Core/Models/newPostDTO';
import * as moment from 'moment';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { TransferRateListDTO } from 'src/app/Core/Models/transferRateDTO';
import { PricingPopupComponent } from 'src/app/hotel/panel/pricing-popup/pricing-popup.component';
import { Title } from "@angular/platform-browser";
import { RoomsComponent } from "../rooms/rooms.component";


@Component({
  selector: 'prs-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  minDate = new Date()
  isLoading = false;
  hotelLoading = false;
  cities: categoriesDTO[] | CityListRes[] = []
  transferRates: TransferRateListDTO[] = [];
  packages: PackageTourDTO[] = [];
  hotels: any[] = [];
  origin_city: any;
  destination_city: any;
  flights: number[] = []
  statuses: statusesDTO[] = [];
  currencies: any
  req: TourSetDTO = {
    title: '',
    origin_id: 0,
    destination_id: 0,
    night_num: 0,
    day_num: 0,
    partnerIds: [],
    tour_type: 0,
    checkin: '',
    checkout: '',
    expired_at: '',
    status_id: 0,
    flights: [],
    packages: []
  }
  partnerNames: any = []
  titleFC = new FormControl('', [Validators.required])
  origin_idFC = new FormControl('', [Validators.required])
  destination_idFC = new FormControl('', [Validators.required])
  night_numFC = new FormControl('', [Validators.required])
  day_numFC = new FormControl('', [Validators.required])
  tour_typeFC = new FormControl(false, [Validators.required])
  checkinFC = new FormControl('', [Validators.required])
  checkoutFC = new FormControl('', [Validators.required])
  expired_atFC = new FormControl('', [Validators.required])
  status_idFC = new FormControl(0, [Validators.required])
  is_bundle: boolean = false
  partners: any[] = []
  selectedCurrency: string = ''
  rooms: any[] = []
  constructor(
    public title: Title,
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
    errorService.clear()
  }

  ngOnInit() {
    this.title.setTitle('افزودن تور | هتل و بلیط')

    this.getCities();
    this.getPageData();
  }

  change() {
    console.log(this.is_bundle)
  }

  getPageData(): void {
    this.isLoading = true;
    this.tourApi.createPageTour().subscribe((res: any) => {
      if (res.isDone) {
        this.statuses = res.data.statuses;
        this.partners = res.data.partners;
        this.currencies = res.data.currencies
        this.rooms = res.data.roomTypes
        debugger
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;

    }, (error: any) => {
      // this.message.error()
      this.isLoading = false;

    })
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
      is_bundle: this.is_bundle,
      currencies: this.selectedCurrency,
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
      partnerIds: this.getPartners(),
      packages: this.packages
    }
  }

  getPartners() {
    let result: number[] = [];
    if (this.partnerNames.length > 0) {
      this.partnerNames.forEach((x: any) => {
        let itemFiltered: any = this.partners.filter((item: any) => item.name === x)
        if (itemFiltered.length > 0) {
          result.push(itemFiltered[0].id);
        }
      })
    }
    return result
  }


  addHotel() {
    let item: PackageTourDTO = {
      id: Math.random() * 1000,
      hotel_id: 0,
      order_item: 0,
      offered: false,
      cwb: '0',
      child_age: '',
      rooms: []
    };
    this.packages.push(item);

    console.log(this.packages)
  }

  removePackage(index: number) {
    this.packages.splice(index, 1);
  }

  openRooms(hotelid: any, rooms: any) {

  debugger
    this.dialog.open(RoomsComponent, {
      width: '80%',
      height: "auto",
      data: {
        roomTypes: this.rooms,
         hotelID: hotelid,
          selectedRooms: rooms
      }
    }
    ).afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.packages.findIndex((item: any) => item.id === result.hotelID);
        this.packages[index].rooms = result.rooms

      }
    })
  }


  getHotels(): void {
    this.hotelLoading = true
    if (this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        "destination_id": this.destination_idFC.value,
        "checkin": this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        "checkout": this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.tourApi.gethotels(req).subscribe((res: any) => {
        if (res.isDone) {
          this.hotels = res.data;
          // this.addHotel();
        } else {
          this.message.custom(res.message);
        }
        this.hotelLoading = false;

      }, (error: any) => {
        this.hotelLoading = false

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
        this.errorService.recordError(error.error.errors);
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
    this.onTitleGenerator()
    this.getTransferRates();
    this.getHotels()
  }


  getHotelSelected(hotel: any, index: number) {
    this.packages[index].hotel_id = hotel.id
  }




  changeTransferRates() {
    this.flights = [];
    this.transferRates.forEach(x => {
      if (x.isChecked) {
        this.flights.push(x.id);
      }
    })
  }

  onTitleGenerator(origin: string | null = null, destination: string | null = null) {
    let month = ''
    let monthSplits = []
    let monthNum = '0'
    let monthDay = '0'
    if (this.checkinFC.value) {
      month = this.calenderService.convertDate(this.checkinFC.value, 'fa')
      monthSplits = month.split('/')
      monthNum = monthSplits.length > 0 ? monthSplits[1] : '0'
      monthDay = monthSplits.length > 2 ? monthSplits[2] : '0'
    }

    this.titleFC.setValue('تور' + ' ' + (destination ? destination : this.destination_city?.name ?? '') + ' ' +
      monthDay + ' ' +
      (this.calenderService.getMonthFa(+monthNum) ?? '') + ' ' +
      this.night_numFC.value + ' شب ' + 'از ' + (origin ? origin : this.origin_city?.name ?? ''))
  }


  getStCity(cityItemSelected: any): void {
    this.origin_idFC.setValue(cityItemSelected.id);
    this.origin_city = cityItemSelected
    this.onTitleGenerator()
  }

  getEndCity(cityItemSelected: any): void {
    this.destination_idFC.setValue(cityItemSelected.id);
    this.destination_city = cityItemSelected
    this.onTitleGenerator()
    this.getTransferRates();
    this.getHotels()

  }

  openPricingCalendar(index: number, hotelId: number) {
    const hotelFiltered = this.hotels.filter(x => x.id === +hotelId);
    const hotel = hotelFiltered.length > 0 ? hotelFiltered[0] : null
    if (hotelId === 0 || !hotelId) {
      this.message.custom('لطفا هتل خود را انتخاب کنید');
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
