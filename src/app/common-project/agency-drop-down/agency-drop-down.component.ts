import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TourApiService} from "../../Core/Https/tour-api.service";

@Component({
  selector: 'prs-agency-drop-down',
  templateUrl: './agency-drop-down.component.html',
  styleUrls: ['./agency-drop-down.component.scss']
})
export class AgencyDropDownComponent implements OnChanges, OnInit{
  @Input() agency_id?:any=0
  @Input() hotel_id?:number=0
  selected_agency_id:any=0
  @Output() result=new EventEmitter()
  agencies :any[]=[]
  constructor(public tourApi:TourApiService,){

    // this.getAgenciesBasedOnHotelId(this.hotel_id)
    console.log(this.hotel_id)

  }

  ngOnInit() {
    // this.getAgenciesBasedOnHotelId(this.hotel_id)
  }

  passToParent(){
    this.result.emit(this.selected_agency_id)
  }
  ngOnChanges() {
    if(this.hotel_id && this.hotel_id!==0){
      this.getAgenciesBasedOnHotelId(this.hotel_id)
    }

    if(this.agency_id && +this.agency_id!==0){
      this.selected_agency_id= +this.agency_id
    }

  }

  changeAgency(e:any){

    this.selected_agency_id=e.target.value

    this.passToParent()
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
        // this.message.custom(res.message);
      }
      // this.isLoading = false;

    }, (error: any) => {
      // this.message.error()
      // this.isLoading = false;

    })
  }
}
