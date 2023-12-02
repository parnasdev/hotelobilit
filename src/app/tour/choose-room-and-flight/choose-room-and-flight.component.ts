import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { TourApiService } from '../core/https/tour-api.service';
import { IFile, IFlight, IFlights, IRoom, ITourInfoRes, ITourListReq } from '../core/models/tour.model';

@Component({
  selector: 'prs-choose-room-and-flight',
  templateUrl: './choose-room-and-flight.component.html',
  styleUrls: ['./choose-room-and-flight.component.scss']
})
export class ChooseRoomAndFlightComponent implements OnInit {

  isRoom = false
  slug = '';
  chd_count = 0;
  isLoading = false;
  req: ITourListReq = {
    origin: '',
    date: '',
    destination: '',
    stayCount: 0
  }


  data: ITourInfoRes = {
    flights: [],
    hotel: {
      id: 0,
      title: '',
      titleEn: '',
      checkin: '',
      checkout: '',
      slug: '',
      is_domestic: false,
      thumbnail: {
        id: 0,
        path: '',
        type: 0,
        url: ''
      },
      gallery: [],
      stars: '',
      location: '',
      coordinates: '',
      address: '',
      services: [],
      rooms: [],
    },
    rooms: []
  }
  paginate: any;
  paginateConfig: any;


  constructor(
    public api: TourApiService,
    public cityApi: CityApiService,
    public publicService: PublicService,
    public reserveApi: ReserveApiService,
    public router: Router,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? ''
    this.getHotelInfo();
  }

  setReq() {
    this.route.queryParams.subscribe(params => {
      this.req = {
        origin: params['origin'],
        date: params['date'],
        destination: params['destination'],
        stayCount: params['stayCount'] ?? 1
      }
    }
    );
  }


  roomCollapse() {
    this.isRoom = !this.isRoom
  }




  getHotelInfo(): void {
    this.setReq();
    this.isLoading = true;
    this.api.getTourInfo(this.req, this.slug).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data;
          this.setRoomsToFlights();
        } else {
          this.publicService.message.custom(res.message);
        }
        this.isLoading = false;
      }, error: (error: any) => {
        this.isLoading = false;
        this.publicService.message.error()
      }
    })
  }

  setRoomsToFlights() {
    this.data.flights.forEach(x => {
      x.rooms = this.data.rooms;
    })
  }

  getNight(date: string, returnDate: string, checkin_tomorrow: boolean, checkout_yesterday: boolean) {
    let nights = 0;
    if (!checkin_tomorrow && !checkout_yesterday) {
      nights = this.publicService.calendar.enumerateDaysBetweenDates(date, returnDate).length - 1;
    } else if (checkin_tomorrow && !checkout_yesterday) {
      date = moment(date).add(1, 'days').format('YYYY-MM-DD');
      nights = this.publicService.calendar.enumerateDaysBetweenDates(date, returnDate).length - 1;
    } else if (!checkin_tomorrow && checkout_yesterday) {
      returnDate = moment(returnDate).add(-1, 'days').format('YYYY-MM-DD');
      nights = this.publicService.calendar.enumerateDaysBetweenDates(date, returnDate).length - 1;
    } else {
      date = moment(date).add(1, 'days').format('YYYY-MM-DD');
      returnDate = moment(returnDate).add(-1, 'days').format('YYYY-MM-DD');
      nights = this.publicService.calendar.enumerateDaysBetweenDates(date, returnDate).length - 1;
    }
    return nights

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



  checkFlightCapacity(flightIndex: number, roomIndex: number) {
    let count = 0;
    (this.data.flights[flightIndex].rooms ?? []).forEach((room) => {
      count += (room.count ?? 0) * room.Adl_capacity;
    })
    count += (this.data.flights[flightIndex].rooms ?? [])[roomIndex].Adl_capacity
    if (count <= this.data.flights[flightIndex].departure.capacity && count <= this.data.flights[flightIndex].return.capacity) {
      return true;
    } else {
      return false
    }
  }



  plus(roomIndex: number, flightIndex: number) {
    if (this.checkFlightCapacity(flightIndex, roomIndex)) {
      let item = this.data.flights[flightIndex].rooms[roomIndex]

      if (item.rate.available_room_count > (this.data.flights[flightIndex].rooms[roomIndex].count ?? 0)) {
        this.data.flights[flightIndex].selectedRooms = this.data.flights[flightIndex].selectedRooms ?? [];
        let room: IRoom = {
          room_id: item.room_id,
          user: item.user,
          services: item.services,
          currencies: item.currencies,
          room_type: item.room_type,
          room_type_en: item.room_type_en,
          room_type_id: item.room_type_id,
          Adl_capacity: item.Adl_capacity,
          chd_capacity: item.chd_capacity,
          total_extra_count: item.total_extra_count,
          extra_bed_count: item.extra_bed_count,
          count: 0,
          age_child: item.age_child,
          online_reservation: item.online_reservation,
          coefficient: item.coefficient,
          has_coefficient: item.has_coefficient,
          rate: item.rate,
          chd_count: 0,
          inf_count: 0,
          extra_count: 0,
          adl_count: item.Adl_capacity

        };
        this.data.flights[flightIndex].selectedRooms?.push(room);
        this.data.flights[flightIndex].rooms[roomIndex].count = (this.data.flights[flightIndex].rooms[roomIndex].count ?? 0) + 1
      }
    } else {
      this.publicService.message.custom('پرواز برای این تعداد مسافر ظرفیت ندارد')
    }
  }



  minus(roomIndex: number, flightIndex: number) {
    if ((this.data.flights[flightIndex].rooms[roomIndex].count ?? 0) > 0) {
      let room = this.data.flights[flightIndex].rooms[roomIndex];
      let index = (this.data.flights[flightIndex].selectedRooms ?? []).findIndex(x => x.room_type_id === room.room_type_id)
      this.data.flights[flightIndex].selectedRooms?.splice(index, 1)
      this.data.flights[flightIndex].rooms[roomIndex].count = (this.data.flights[flightIndex].rooms[roomIndex].count ?? 0) - 1
    }
  }


  getInsuransePrice(roomIndex: number): number {
    return 0;
  }

  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }



  submit(flightID: number, returnFlightID: number, flightIndex: number) {
    if ((this.data.flights[flightIndex].selectedRooms ?? []).length > 0) {
      this.router.navigate([`/tour/reserve/${this.data.hotel.id}/${flightID}/${returnFlightID}`], {
        queryParams: {
          checkin: this.data.hotel.checkin,
          checkout: this.data.hotel.checkout,
          stayCount: this.req.stayCount,
          rooms: JSON.stringify(this.data.flights[flightIndex].selectedRooms)
        }
      })
    } else {
      this.publicService.message.custom('لطفا برای رزرو حداقل یک اتاق انتخاب کنید')
    }

  }


  plusCount(ItemType: string, roomIndex: number, flightIndex: number) {
    let item = (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex]
    let extra_bed_count = item.extra_bed_count
    switch (ItemType) {
      case 'extra_count':
        if ((item.extra_count ?? 0) < extra_bed_count) {
          if (this.checkExtraPerson(flightIndex, roomIndex)) {
            (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].extra_count =
              ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].extra_count ?? 0) + 1
          } else {
            this.publicService.message.custom('به دلیل نبود ظرفیت امکان اضافه کردن وجود ندارد')
          }
        }
        break;
      case 'chd_count':
        if ((item.chd_count ?? 0) < item.chd_capacity) {
          if (this.checkExtraPerson(flightIndex, roomIndex)) {
            (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].chd_count =
              ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].chd_count ?? 0) + 1
          } else {
            this.publicService.message.custom('به دلیل نبود ظرفیت امکان اضافه کردن وجود ندارد')
          }
        }
        break;
      case 'inf_count':
        if ((item.inf_count ?? 0) < (item.Adl_capacity ?? 0)) {

          (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].inf_count =
            ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].inf_count ?? 0) + 1
        }
        break;
      default:
        break;
    }
  }

  checkExtraPerson(flightIndex: number, roomIndex: number) {
    let room = (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex]
    let total_extra_count = room.total_extra_count;
    let item = (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex]
    let sum = (item.extra_count ?? 0) + (item.chd_count ?? 0);
    if (sum < total_extra_count) {
      return true
    } else {
      return false
    }
  }



  minusCount(ItemType: string, roomIndex: number, flightIndex: number) {
    let item = (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex]
    switch (ItemType) {
      case 'extra_count':
        if ((item.extra_count ?? 0) > 0) {

          (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].extra_count = ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].extra_count ?? 0) - 1
        }
        break;
      case 'chd_count':
        if ((item.chd_count ?? 0) > 0) {
          (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].chd_count = ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].chd_count ?? 0) - 1
        }
        break;
      case 'inf_count':
        if ((item.inf_count ?? 0) > 0) {
          (this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].inf_count = ((this.data.flights[flightIndex].selectedRooms ?? [])[roomIndex].inf_count ?? 0) - 1
        }
        break;
      default:
        break;
    }
  }


  getRoomTotalPrice(type: string, room: IRoom, flight: IFlights) {
    let roomPrice = 0;
    let flightPrice = 0

    switch (type) {
      case 'adl':
        roomPrice = room.rate.price
        flightPrice = flight.departure.adl_price + flight.return.adl_price
        break
      case 'chd':
        roomPrice = room.rate.chd_price;
        flightPrice = flight.departure.chd_price + flight.return.chd_price
        break
      case 'extra':
        roomPrice = room.rate.extra_price
        flightPrice = flight.departure.adl_price + flight.return.adl_price
    }
    let servicePrice: number = 0;
    room.services.forEach(x => {
      servicePrice += x.rate
    })
    return roomPrice + flightPrice + servicePrice
  }

  removeSelectedRoom(x: any, flightIndex: number, childIndex: number): void {
    this.data.flights[flightIndex].rooms.forEach(room => {
      if (room.room_type_id === x.room_type_id) {
        room.count = (room.count ?? 0) - 1;
      }
    });
    (this.data.flights[flightIndex].selectedRooms ?? []).splice(childIndex, 1);
  }
  getExtraBedCount(roomId: number) {
    let extra_bed_countFiltered = this.data.rooms.filter(x => x.room_type_id === roomId)
    return extra_bed_countFiltered.length > 0 ? extra_bed_countFiltered[0].extra_bed_count : 0;
  }
}
