import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { HotelApiService } from 'src/app/Core/Https/hotel-api.service';
import { hotelInfoDTO } from 'src/app/Core/Models/hotelDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-pricing-popup',
  templateUrl: './pricing-popup.component.html',
  styleUrls: ['./pricing-popup.component.scss']
})
export class PricingPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PricingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {hotelId: string , slug: string },
    public dialog: MatDialog,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public cityApiService: CityApiService,
    public route: ActivatedRoute,
    public hotelApi: HotelApiService,
    public message: MessageService) { }
    isLoading = false;
    showCalendar = true;

    info: hotelInfoDTO = {
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
   
  
    ngOnInit(): void {
      this.getInfo()
    }
  
    getInfo(): void {
      this.isLoading = true;
      this.hotelApi.getHotel(this.data.slug, true).subscribe((res: any) => {
        this.isLoading = false;
        if (res.isDone) {
          this.info = res.data;
          if (this.info.rooms.length > 0) {
            this.activedRoom = this.info.rooms[0].id;
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
