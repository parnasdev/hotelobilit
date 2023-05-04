import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { RatingResDTO, RoomDTO, ratigListReqDTO } from 'src/app/Core/Models/newPostDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  isLoading = false;
  standardTwinId = 148;
  standardTwinCoefficient = 0
  showCalendar = true;
  slug = '';
  id = ''
  pricingTypeFC = new FormControl('0')
  req!: ratigListReqDTO;
  activedRoom = 0;
  ratingData!: RatingResDTO;
  rooms: RoomDTO[] = [];
  constructor(public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
    public route: ActivatedRoute,
    public api: PostApiService,
    public message: MessageService,) { }

  ngOnInit(): void {
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
        
        if (this.rooms.length > 0) {
          this.activedRoom = this.rooms[0].id;
          this.reload();
        }
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
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

  changeTab(tab: number): void {
    this.activedRoom = tab
    this.reload()
  }


  reload() {
    this.showCalendar = false;
    setTimeout(() => this.showCalendar = true);
  }
  typeChanged() {
    console.log(this.pricingTypeFC.value);

  }
}
