import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { RateDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
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

  // getSearchData(): void {
  //   this.setReq();
  //   this.api.search('flights', this.req).subscribe((res: any) => {
  //     if (res.isDone) {
  //       this.paginate = res.meta;
  //       this.paginateConfig = {
  //         itemsPerPage: this.paginate.per_page,
  //         totalItems: this.paginate.total,
  //         currentPage: this.paginate.current_page
  //       }
  //     } else {
  //       this.message.custom(res.message);
  //     }
  //   }, (error: any) => {
  //     this.message.error()
  //   })
  // }

  roomCollapse() {
    this.isRoom = !this.isRoom
  }

  getPrice(price: number, rates: RateDTO[]): number {
    let roomPrices = 0;
    rates.forEach(x => {
      roomPrices += x.price;
    })
    return roomPrices + price;
  }


  getRoomSelectedID() {

    return this.data.find(r => r.selectedRooms.length > 0)?.id ?? 0;
  }

  getHotelInfo(): void {
    this.setReq();
    this.isLoading = true;
    this.api.searchHotelInfo('hotels', this.slug, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.hotelInfo = res.data;
        this.convertData(this.hotelInfo.flights);

        // this.paginate = res.meta;
        // this.paginateConfig = {
        //   itemsPerPage: this.paginate.per_page,
        //   totalItems: this.paginate.total,
        //   currentPage: this.paginate.current_page
        // }

      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;

    }, (error: any) => {
      this.isLoading = false;

      this.message.error()
    })
  }

  convertData(flights: transferRateListDTO[]) {
    flights.forEach(flight => {
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
        rooms: this.hotelInfo.rooms,
        selectedRooms: []
      }
      this.data.push(obj)
    })
  }

  getUniqueRooms(rooms: any): any {
    let newRooms: any[] = []
    let room: any;
    rooms.forEach((item: any, index: number) => {
      room = newRooms.find((x: roomDTO) => x.room_type === item.room_type)
      if (!room) {
        newRooms.push(item)
      } else {
        let oldPrice = this.getRoomUniquePrice(room.rates, index)
        let newPrice = this.getRoomUniquePrice(item.rates, index)
        if (newPrice > oldPrice) {
          let index = newRooms.findIndex(x => x.id === room.id)
          newRooms.splice(index, 1)
          newRooms.push(item)
        }
      }
    })
    return newRooms
  }

  getRoomUniquePrice(rates: RateDTO[], roomIndex: number): number {
    let price = 0;
    rates.forEach(rate => {
      price += rate.price * this.getCurrencyRate(rate.currency_code, roomIndex);
    })
    return price
  }

  plus(roomIndex: number, flightIndex: number) {

    if (this.checkFlightCapacity(flightIndex, roomIndex)) {
      let capacity = this.getRoomCapacity(this.data[flightIndex].rooms[roomIndex].rates);
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

  getRoomPrice(rates: RateDTO[], roomIndex: number, flightID: number): number {
    let price = 0;
    let flightFiltred = this.hotelInfo.flights.filter(x => x.id === flightID)
    let flightPrice = flightFiltred.length > 0 ? flightFiltred[0].adl_price : 0;
    rates.forEach(rate => {
      price += rate.price * this.getCurrencyRate(rate.currency_code, roomIndex);
    })
    return price + flightPrice + this.getInsuransePrice(roomIndex) + this.getTransferPrice(roomIndex, flightID);
  }

  getTransferPrice(roomIndex: number, flightID: number) {
    let destID = this.data.find(x => x.id === flightID)?.destination_id
    let transfer = this.hotelInfo.rooms[roomIndex].services.find(transfer => transfer.airport_id === destID);
    return (transfer?.rate ?? 0) * this.getCurrencyRate(transfer?.rate_type ?? '', roomIndex)
  }

  calculatePrice(flightID: number) {
    let roomPrice = 0;
    let rooms = this.getUniqueRooms(this.hotelInfo.rooms)
    rooms.forEach((room: any, index: number) => {
      if (room.room_type_id === environment.TWIN_ROOM_ID) {
        roomPrice = this.getRoomPrice(room.rates, index, flightID)
      }
    })
    return roomPrice
  }

  calculatePriceByRates(flightID: number, rates: RateDTO[], roomIndex: number): number {
    let roomPrice = 0;
    roomPrice = this.getRoomPrice(rates, roomIndex, flightID)
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

  getRoomCapacity(rates: RateDTO[]): number {
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
          item.extra_count += 1
        }
        break;
      case 'chd_count':
        if (item.chd_count < this.chd_count) {
          item.chd_count += 1
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
