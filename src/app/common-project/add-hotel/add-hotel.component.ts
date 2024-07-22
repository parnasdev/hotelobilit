import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {BoardType, PackageTourDTO} from "../../Core/Models/tourDTO";
import {TourApiService} from "../../Core/Https/tour-api.service";
import {MessageService} from "../../Core/Services/message.service";
import {RoomsComponent} from "../../packages/rooms/rooms.component";
import {MatDialog} from "@angular/material/dialog";
import {PricingPopupComponent} from "../../hotel/panel/pricing-popup/pricing-popup.component";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'prs-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent implements OnChanges{

    protected readonly boardtype = BoardType;


    @Input() is_bundle=false;
    @Input() incommingData:any='';
    @Output() result = new EventEmitter();
  @Input() index=0;
    @Input() hotels:any[]=[];
    @Input() selectedFlights:any[]=[];
    @Input() package:PackageTourDTO={hotel_id : 0,
      offered:false,
      order_item:0,
      board_type: "",
      provider_id: 0,
      rooms: [
      ]};
  agencies:any[]=[]
constructor(public tourApi:TourApiService,
            public dialog: MatDialog,
     public message: MessageService,
) {
  console.log(this.package)
}
  getAgency(e:any){

    this.package.provider_id= e.target.value;

  }

  ngOnChanges() {
    if (this.incommingData && this.incommingData !== '') {

this.package=this.incommingData

      console.log(this.incommingData)
      this.getAgenciesBasedOnHotelId(this.incommingData.hotel_id)

    }

  }
  getBoardType(e:any){
    this.package.board_type= e.target.value;
    this.sendToParent()

  }

  getHotelSelected(hotel: any) {

    this.package.hotel_id = hotel.id
    this.sendToParent()

    this.getAgenciesBasedOnHotelId(hotel.id)
  }

  sendToParent(){
    this.result.emit(this.package)
  }

  getAgenciesBasedOnHotelId(hotelId:any): void {
    let req ={
      hotel_id:hotelId
    }
    // this.isLoading = true;
    this.tourApi.getAgencies(req).subscribe((res: any) => {
      if (res.isDone) {
        this.agencies=res.data
      } else {
        this.message.custom(res.message);
      }
      // this.isLoading = false;

    }, (error: any) => {
      this.message.error()
      // this.isLoading = false;

    })
  }

  openRooms(id:any,hotelid: any, rooms: any,providerId:any) {

    this.dialog.open(RoomsComponent, {
        width: '80%',
        height: "auto",
        data: {
          // roomTypes: this.rooms,
          hotelID: hotelid,
          providerId:providerId,
          selectedRooms: rooms,
          selectedFlights:this.selectedFlights
        }
      }
    ).afterClosed().subscribe((result: any) => {
      if (result) {
        // let index = this.packages.findIndex((item: any) => item.id === result.hotelID);
        this.package.rooms = result.rooms
        this.sendToParent()
      }
    })
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
