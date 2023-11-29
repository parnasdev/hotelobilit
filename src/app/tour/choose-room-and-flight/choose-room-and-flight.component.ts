import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';

import { PublicService } from 'src/app/Core/Services/public.service';
import { TourApiService } from '../core/https/tour-api.service';
import { ITourInfoRes, ITourListReq } from '../core/models/tour.model';

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






  plus(roomIndex: number, flightIndex: number) {

  }


  minus(roomIndex: number, flightIndex: number) {
    // if ((this.data[flightIndex].rooms[roomIndex].count ?? 0) > 0) {
    //   this.data[flightIndex].rooms[roomIndex].count = (this.data[flightIndex].rooms[roomIndex].count ?? 0) - 1
    // }
    // this.getSelectedRoom(flightIndex)
  }


  getStars(count: string | number): number[] {
    return Array.from(Array(+count).keys());
  }



  submit(flightID: number, flightIndex: number, checkin: string, checkout: string) {
 
  }


  plusCount(ItemType: string, roomId: number, flightIndex: number, roomIndex: number) {

  }

  checkExtraPerson(flightIndex: number, roomId: number, roomIndex: number) {

  }

  getExtraBedCount(roomId: number) {
   
  }

  minusCount(ItemType: string, roomId: number, flightIndex: number, roomIndex: number) {

  }

}
