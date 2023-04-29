import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { HotelApiService } from 'src/app/Core/Https/hotel-api.service';
import { hotelInfoDTO } from 'src/app/Core/Models/hotelDTO';
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
  showCalendar = true;
  slug = '';
  id = ''
  data: hotelInfoDTO = {
    name: '',
    city: {
      name: '',
      id: 0,
      type: 0,
      image: '',
      faq: [],
      slug: '',
      slugEn: '',
      description: '',
      images: [],
      nameEn: ''
    },
    nameEn: '',
    stars: '',
    location: '',
    rooms: [],
    address: '',
    coordinate: { lat: 0, lng: 0 },
    images: [],
    mediaLink: [],
    thumbnail: '',
    body: '',
    services: [],
    status: '',
    phone: '',
    tours: [],
  };
  activedRoom = 0;
  constructor(public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
    public route: ActivatedRoute,
    public hotelApi: HotelApiService,
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
    this.hotelApi.getHotel(this.slug, true).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.data = res.data;
        if (this.data.rooms.length > 0) {
          this.activedRoom = this.data.rooms[0].id;
          this.reload()
        }
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.message.error()
    })
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

}
