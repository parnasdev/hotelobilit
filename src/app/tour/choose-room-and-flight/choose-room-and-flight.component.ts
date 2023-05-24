import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { TourApiService } from 'src/app/Core/Https/tour-api.service';
import { RateDTO } from 'src/app/Core/Models/newPostDTO';
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


  req: TourSearchReqDTO = {
    origin: 0,
    date: '',
    destination: 0,
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

  getHotelInfo(): void {
    this.setReq();
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
    }, (error: any) => {
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

  calculatePrice(flightID: number) {
    let price = 0;
    let roomPrice = 0;
    let flightFiltred = this.hotelInfo.flights.filter(x => x.id === flightID)
    let flightPrice = flightFiltred.length > 0 ? flightFiltred[0].adl_price : 0;
    this.hotelInfo.rooms.forEach(room => {
      if (room.room_type_id === environment.TWIN_ROOM_ID) {
        roomPrice = this.getRoomPrice(room.rates)
      }
    })
    price = roomPrice + flightPrice;
    return price
  }

  getRoomCapacity(rates: RateDTO[]): number {
    let list: number[] = [];
    rates.forEach(rate => {
      list.push(rate.available_room_count)
    })
    list = list.sort((a, b) => b - a)
    return list.length > 0 ? list[0] : 0
  }

  getRoomPrice(rates: RateDTO[]): number {
    let price = 0;
    rates.forEach(rate => {
      price += rate.price;
    })
    return price;
  }

  submit(flightID: number, flightIndex: number) {
    // console.log(this.data[flightIndex].selectedRooms);

    this.router.navigate([`reserve/${this.hotelInfo.id}/${flightID}`], {
      queryParams: {
        checkin: this.req.date,
        stayCount: this.req.stayCount,
        rooms: JSON.stringify(this.data[flightIndex].selectedRooms)
      }
    })
  }
  removeSelectedRoom(x: ReserveRoomsReqDTO, index: number, flightIndex: number): void {
    this.data[flightIndex].rooms.forEach(room => {
      if (room.id === x.room_id) {
        room.count = (room.count ?? 0) - 1;
      }
    })
    this.data[flightIndex].selectedRooms.splice(index, 1);
  }


}
