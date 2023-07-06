import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { RateDTO, RoomDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
import { ChooseTourListDTO, HotelSearchResDTO, TourSearchReqDTO } from 'src/app/Core/Models/newTourDTO';
import { transferRateListDTO } from 'src/app/Core/Models/newTransferDTO';
import { ReserveRoomsReqDTO } from 'src/app/Core/Models/reserveDTO';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'prs-choose-room-and-flight',
  templateUrl: './choose-room-and-flight.component.html',
  styleUrls: ['./choose-room-and-flight.component.scss']
})
export class ChooseRoomAndFlightComponent implements OnInit {
  isMobile = false;
  isDesktop = false;
  isTablet = false;
  isRoom = false
  slug = '';
  chd_count = 2;
  isLoading = false;
  req: TourSearchReqDTO = {
    origin: '',
    date: '',
    destination: '',
    stayCount: 0
  }


  hotelInfo: HotelSearchResDTO = {
    id: 0,
    title: '',
    slug: '',
    is_domestic: false,
    flights: [],
    titleEn: '',
    location: '',
    address: '',
    rooms: [],
    stars: 0,
    gallery: [],
    thumbnail: { path: '', url: '', },
    services: []
  }
  paginate: any;
  paginateConfig: any;

  data: ChooseTourListDTO[] = []

  constructor(
    public api: TourApiService,
    public cityApi: CityApiService,
    public mobileService: ResponsiveService,
    public calendar: CalenderServices,
    public reserveApi: ReserveApiService,
    public router: Router,
    public route: ActivatedRoute,
    public message: MessageService,
  ) {
    this.isMobile = mobileService.isMobile()
    this.isDesktop = mobileService.isDesktop()
    this.isTablet = mobileService.isTablet()
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? ''
    this.getHotelInfo();
  }

  setReq() {
    this.route.queryParams.subscribe(params => {
      this.req = {
        origin: params['origin'],
        date: moment(params['stDate'], 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
        destination: params['dest'],
        stayCount: params['night'] ?? 1
      }
    }
    );
  }


  roomCollapse() {
    this.isRoom = !this.isRoom
  }

  // getPrice(price: number, rates: RateDTO[]): number {
  //   let roomPrices = 0;
  //   if (rates.length > 0) {
  //     if (rates[0].checkin_base) {
  //       rates.forEach(x => {
  //         roomPrices += x.offer_price;
  //       })
  //     } else {
  //       rates.forEach(x => {
  //         roomPrices += x.price;
  //       })
  //     }

  //   } else {
  //     roomPrices = 0
  //   }
  //   return roomPrices + price;
  // }


  getRoomSelectedID() {

    return this.data.find(r => r.selectedRooms.length > 0)?.id ?? 0;
  }

  getHotelInfo(): void {
    this.setReq();
    this.isLoading = true;
    this.api.searchHotelInfo('hotels', this.slug, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.hotelInfo = res.data;

        this.convertData();


      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;

    }, (error: any) => {
      this.isLoading = false;

      this.message.error()
    })
  }

  convertData() {
    let rooms = this.hotelInfo.rooms;
    this.hotelInfo.flights.forEach(flight => {
      let obj: ChooseTourListDTO = {
        id: flight.id,
        origin_name: flight.origin_name,
        origin_id: flight.origin_id,
        destination_name: flight.destination_name,
        destination_id: flight.destination_id,
        airline_name: flight.airline_name,
        airline_id: flight.airline_id,
        airline_thumb: flight.airline_thumb,
        flight: flight.flight,
        date: flight.date,
        time: flight.time,
        adl_price: flight.adl_price,
        flight_number: flight.flight_number,
        chd_price: flight.chd_price,
        inf_price: flight.inf_price,
        capacity: flight.capacity,
        is_close: flight.is_close,
        description: flight.description,
        rooms: rooms,
        checkin: this.getCheckin(flight.checkin_tomorrow ?? false, flight.checkout_yesterday ?? false, flight.date),
        checkout: this.getCheckout(flight.checkin_tomorrow ?? false, flight.checkout_yesterday ?? false, flight.flight.date),
        selectedRooms: []
      }
      this.data.push(obj)
    })

  }

  getFlightRooms(rooms: RoomDTO[], checkin_tomorrow: boolean, checkout_yesterday: boolean): RoomDTO[] {
    rooms.forEach(x => {
      x.rates = this.convertRates(x.rates, checkin_tomorrow, checkout_yesterday)
    })
    return rooms;
  }
  convertRates(rates: RateDTO[], checkin_tomorrow: boolean, checkout_yesterday: boolean): RateDTO[] {
    // debugger
    if (checkin_tomorrow && !checkout_yesterday) {
      rates.splice(0, 1)
      return rates;
    } else if (!checkin_tomorrow && checkout_yesterday) {
      rates.splice(rates.length - 1, 1)
      return rates;
    } else if (checkin_tomorrow && checkout_yesterday) {
      rates.splice(0, 1)
      rates.splice(rates.length - 1, 1)
      return rates;
    } else {
      rates.splice(rates.length - 1, 1)
      return rates
    }

  }
  getCheckin(checkin: boolean, checkout: boolean, date: string): string {
    if (checkin && !checkout) {
      return moment(date, 'YYYY-MM-DD').add(1, 'days').format('jYYYY/jMM/jDD');
    } else if (!checkin && checkout) {
      return moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
    } else if (checkin && checkout) {
      return moment(date, 'YYYY-MM-DD').add(1, 'days').format('jYYYY/jMM/jDD');
    } else {
      return moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
    }
  }
  getCheckout(checkin: boolean, checkout: boolean, returnDate: string): string {
    if (checkin && !checkout) {
      return moment(returnDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
    } else if (!checkin && checkout) {
      return moment(returnDate, 'YYYY-MM-DD').add(-1, 'days').format('jYYYY/jMM/jDD');
    } else if (checkin && checkout) {
      return moment(returnDate, 'YYYY-MM-DD').add(-1, 'days').format('jYYYY/jMM/jDD');
    } else {
      return moment(returnDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
    }
  }

  getUniqueRooms(rooms: any, flightID: number): any {
    let newRooms: any[] = []
    let room: any;
    rooms.forEach((item: any, index: number) => {
      room = newRooms.find((x: roomDTO) => x.room_type === item.room_type)
      if (!room) {
        newRooms.push(item)
      } else {
        let oldPrice = this.getRoomUniquePrice(room.rates, index, flightID)
        let newPrice = this.getRoomUniquePrice(item.rates, index, flightID)
        if (newPrice > oldPrice) {
          let index = newRooms.findIndex(x => x.id === room.id)
          newRooms.splice(index, 1)
          newRooms.push(item)
        }
      }
    })

    return newRooms
  }



  getRoomUniquePrice(rates: RateDTO[], roomIndex: number, flightID: number): number {
    let price = 0;
    if (rates.length > 0) {
      if (rates[0].checkin_base) {
        price = this.getRatesPrice(rates, 'offer_price', roomIndex, flightID)
      } else {
        price = this.getRatesPrice(rates, 'price', roomIndex, flightID)
      }
    } else {
      price = 0;
    }

    return price
  }



  getRatesPrice(rates: RateDTO[], type = 'price', roomIndex: number, flightID: number): any {
    let price = 0
    if (type === 'price') {
      rates.forEach((rate, index) => {
        if (index < rates.length - 1) {
          price += rate.price * this.getCurrencyRate(rate.currency_code, roomIndex);
        }
      })
    } else {
      rates.forEach((rate, index) => {
        if (index < rates.length - 1) {
          price += rate.offer_price * this.getCurrencyRate(rate.currency_code, roomIndex);
        }
      })
    }
    return price;
  }


  plus(roomIndex: number, flightIndex: number) {
    if (this.checkFlightCapacity(flightIndex, roomIndex)) {
      let capacity = this.getRoomCapacity(this.data[flightIndex].rooms[roomIndex].rates, flightIndex);
      if ((this.data[flightIndex].rooms[roomIndex].count ?? 0) < capacity) {
        this.data[flightIndex].rooms[roomIndex].count = (this.data[flightIndex].rooms[roomIndex].count ?? 0) + 1
      }
      this.getSelectedRoom(flightIndex)
    } else {
      this.message.custom('پرواز برای این تعداد مسافر ظرفیت ندارد')
    }
  }

  minus(roomIndex: number, flightIndex: number) {
    if ((this.data[flightIndex].rooms[roomIndex].count ?? 0) > 0) {
      this.data[flightIndex].rooms[roomIndex].count = (this.data[flightIndex].rooms[roomIndex].count ?? 0) - 1
    }
    this.getSelectedRoom(flightIndex)
  }

  checkFlightCapacity(flightIndex: number, roomIndex: number) {
    let count = 0;
    this.data[flightIndex].rooms.forEach((room) => {
      count += (room.count ?? 0) * room.Adl_capacity;
    })
    count += this.data[flightIndex].rooms[roomIndex].Adl_capacity
    if (count <= this.data[flightIndex].capacity) {
      return true;
    } else {
      return false
    }
  }

  getRoomName(id: number) {
    let result = this.hotelInfo.rooms.filter(x => x.id === id)
    return result.length > 0 ? result[0].room_type : id
  }

  getSelectedRoom(flightIndex: number) {
    this.data[flightIndex].selectedRooms = []
    this.data[flightIndex].rooms.forEach(room => {
      if ((room.count ?? 0) > 0) {
        for (let index = 0; index < (room.count ?? 0); index++) {
          let obj: ReserveRoomsReqDTO = {
            room_id: room.id,
            count: 1,
            adl_count: room.Adl_capacity,
            chd_count: 0,
            inf_count: 0,
            extra_count: 0
          }
          this.data[flightIndex].selectedRooms.push(obj)
        }
      }

    })
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }

  getRoomPrice(rates: RateDTO[], roomIndex: number, flightID: number, type = 'adl'): number {
    let price = 0;

    let flightFiltred = this.hotelInfo.flights.filter(x => x.id === flightID)
    let flightPrice = type === 'adl' ? (flightFiltred.length > 0 ? flightFiltred[0].adl_price : 0) : (flightFiltred.length > 0 ? flightFiltred[0].chd_price : 0);
    if (rates.length > 0) {
      if (rates[0].checkin_base) {
        let offer_price = rates[0].offer_price;
        let offer_price_type = rates[0].currency_code
        rates.forEach(rate => {
          price += offer_price * this.getCurrencyRate(offer_price_type, roomIndex);
        })
      } else {
        price = this.getRatesPrice(rates, 'price', roomIndex, flightID)
      }
    } else {
      price = 0
    }
    return price + flightPrice + this.getInsuransePrice(roomIndex) + this.getTransferPrice(roomIndex, flightID);
  }

  getExtraBedPrice(flightIndex: number, roomSelectedIndex: number): number {
    let price = 0;
    let roomIndex = 0
    this.data[flightIndex].rooms.forEach((x, index) => {
      if (x.id === this.data[flightIndex].selectedRooms[roomSelectedIndex].room_id) {
        roomIndex = index;
      }
    })


    this.data[flightIndex].rooms[roomIndex].rates.forEach((rate: any) => {
      price += rate.extra_price * this.getCurrencyRate(rate.currency_code, roomIndex);
    })
    return price + this.data[flightIndex].adl_price + this.getTransferPrice(roomIndex, this.data[flightIndex].id)
  }

  getTransferPrice(roomIndex: number, flightID: number) {
    let destID = this.data.find(x => x.id === flightID)?.destination_id
    let transfer = this.hotelInfo.rooms[roomIndex].services.find(transfer => transfer.airport_id === destID);
    return (transfer?.rate ?? 0) * this.getCurrencyRate(transfer?.rate_type ?? '', roomIndex)
  }

  calculatePrice(flightID: number) {
    let roomPrice = 0;
    let rooms = this.getUniqueRooms(this.hotelInfo.rooms, flightID)
    rooms.forEach((room: any, index: number) => {
      if (room.room_type_id === environment.TWIN_ROOM_ID) {
        roomPrice = this.getRoomPrice(room.rates, index, flightID)
      }
    })
    return roomPrice
  }

  calculatePriceByRates(flightID: number, rates: RateDTO[], roomIndex: number, type = 'adl'): number {
    let roomPrice = 0;

    roomPrice = this.getRoomPrice(rates, roomIndex, flightID, type)
    return roomPrice
  }

  calculatePriceByName(flightID: number, flightIndex: number, roomSelectedIndex: number, type = 'adl') {
    let roomPrice = 0;
    this.data[flightIndex].rooms.forEach((x, index) => {
      if (x.id === this.data[flightIndex].selectedRooms[roomSelectedIndex].room_id) {
        roomPrice = this.getRoomPrice(x.rates, index, flightID, type)
      }
    })
    return roomPrice
  }

  getCurrencyRate(code: string, roomIndex: number): number {
    let currencies = this.hotelInfo.rooms[roomIndex].currencies;
    if (currencies) {
      switch (code) {
        case 'toman':
          return currencies.toman;
        case 'dollar':
          return currencies.dollar;
        case 'euro':
          return currencies.euro;
        case 'derham':
          return currencies.derham;
        default:
          return 0
      }
    } else {
      return 0;
    }
  }

  getRoomCapacity(rates: RateDTO[], flightIndex: number): number {
    let flightID = this.data[flightIndex].id

    let list: number[] = [];
    rates.forEach(rate => {
      list.push(rate.available_room_count)
    })
    list = list.sort((a, b) => b - a)
    return list.length > 0 ? list[0] : 0
  }

  getInsuransePrice(roomIndex: number): number {
    return 0;
  }

  submit(flightID: number, flightIndex: number) {
    if (this.data[flightIndex].selectedRooms.length > 0) {
      this.router.navigate([`/tour/reserve/${this.hotelInfo.id}/${flightID}`], {
        queryParams: {
          checkin: this.req.date,
          stayCount: this.req.stayCount,
          rooms: JSON.stringify(this.data[flightIndex].selectedRooms)
        }
      })
    } else {
      this.message.custom('لطفا برای رزرو حداقل یک اتاق انتخاب کنید')
    }

  }

  removeSelectedRoom(x: ReserveRoomsReqDTO, index: number, flightIndex: number): void {
    this.data[flightIndex].rooms.forEach(room => {
      if (room.id === x.room_id) {
        room.count = (room.count ?? 0) - 1;
      }
    })
    this.data[flightIndex].selectedRooms.splice(index, 1);
  }

  plusCount(ItemType: string, roomId: number, flightIndex: number, roomIndex: number) {
    let item = this.data[flightIndex].selectedRooms[roomIndex]

    let extra_bed_countFiltered = this.hotelInfo.rooms.filter(x => x.id === roomId)
    let extra_bed_count = extra_bed_countFiltered.length > 0 ? extra_bed_countFiltered[0].extra_bed_count : 0;
    switch (ItemType) {
      case 'extra_count':
        if (item.extra_count < extra_bed_count) {
          if (this.checkExtraPerson(flightIndex, roomId, roomIndex)) {
            item.extra_count += 1
          } else {
            this.message.custom('به دلیل نبود ظرفیت امکان اضافه کردن وجود ندارد')
          }
        }
        break;
      case 'chd_count':
        if (item.chd_count < this.chd_count) {
          if (this.checkExtraPerson(flightIndex, roomId, roomIndex)) {
            item.chd_count += 1
          } else {
            this.message.custom('به دلیل نبود ظرفیت امکان اضافه کردن وجود ندارد')
          }
        }
        break;
      case 'inf_count':
        if (item.inf_count < item.adl_count) {
          item.inf_count += 1
        }
        break;
      default:
        break;
    }
  }

  checkExtraPerson(flightIndex: number, roomId: number, roomIndex: number) {
    let roomFiltered = this.data[flightIndex].rooms.filter(x => x.id === roomId)
    let total_extra_count = roomFiltered.length > 0 ? roomFiltered[0].total_extra_count : 0;
    let item = this.data[flightIndex].selectedRooms[roomIndex]
    let sum = item.extra_count + item.chd_count;
    if (sum < total_extra_count) {
      return true
    } else {
      return false
    }
  }

  getExtraBedCount(roomId: number) {
    let extra_bed_countFiltered = this.hotelInfo.rooms.filter(x => x.id === roomId)
    return extra_bed_countFiltered.length > 0 ? extra_bed_countFiltered[0].extra_bed_count : 0;
  }

  minusCount(ItemType: string, roomId: number, flightIndex: number, roomIndex: number) {
    let item = this.data[flightIndex].selectedRooms[roomIndex]
    switch (ItemType) {
      case 'extra_count':
        if (item.extra_count > 0) {
          item.extra_count -= 1
        }
        break;
      case 'chd_count':
        if (item.chd_count > 0) {
          item.chd_count -= 1
        }
        break;
      case 'inf_count':
        if (item.inf_count > 0) {
          item.inf_count -= 1
        }
        break;
      default:
        break;
    }
  }

}
