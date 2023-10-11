import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { RatingResDTO, RoomDTO, ratigListReqDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'prs-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  key = ''
  isLoading = false;
  standardTwinId = 148;
  standardTwinCoefficient = 0;
  showCalendar = true;
  slug = '';
  id = '';
  isCoefficient = '0';
  req!: ratigListReqDTO;
  activedRoom = 0;
  roomTypeId = 0;
  calendarLang = 'shamsi'
  currentLang = ''
  ratingData!: RatingResDTO;
  rooms: roomDTO[] = [];
  constructor(
    public title: Title,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
    public route: ActivatedRoute,
    public api: PostApiService,
    public message: MessageService,) {
     this.currentLang = localStorage.getItem('hotelobilit-lang') ?? 'fa'
     }

  ngOnInit(): void {
    this.title.setTitle('قیمت گذاری هتل | هتل و بلیط')

    // @ts-ignore
    this.slug = this.route.snapshot.paramMap.get('slug');
    // @ts-ignore
    this.id = this.route.snapshot.paramMap.get('id');
    this.getInfo()
  }

  getInfo(): void {
    this.isLoading = true;
    this.req = {
      fromDate: '',
      toDate: '',
      hotelId: +this.id,
      roomId: 0
    }
    this.api.ratingList(this.req).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.ratingData = res.data;
        this.rooms = this.ratingData.hotel.rooms ?? [];

        let obj: roomDTO | undefined = this.rooms.find(x => x.room_type === 'دوتخته' || x.room_type === 'دو تخته')
        this.activedRoom = obj ? obj.id : 0
        this.roomTypeId = obj ? obj.room_type_id : 0
        if (obj && obj.has_coefficient) {
          this.isCoefficient = '1'
        } else {
          this.isCoefficient = '0'
        }

      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }

  getTwinCoefficient() {
    let result = 0
    this.ratingData.hotel.rooms?.forEach(item => {
      if (item.room_type_id === this.standardTwinId) {
        result = item.coefficient
      }
    })
    return result
  }


  getStars(count: string): number[] {
    return Array.from(Array(+count).keys());
  }

  changeTab(id: number, roomTypeId: number): void {
    this.activedRoom = id
    this.roomTypeId = roomTypeId


    this.reload()
  }

  getRoom(): roomDTO | null {
    let room = this.rooms.filter(x => x.room_type_id === this.roomTypeId)
    return room.length > 0 ? room[0] : null
  }


  reload() {
    this.showCalendar = false;
    setTimeout(() => this.showCalendar = true);
  }

}
