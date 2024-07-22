import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TourApiService} from "../../Core/Https/tour-api.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<RoomsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,public tourApi:TourApiService,     public message: MessageService,
  ) {
    this.inputForm=new FormGroup({
      'rooms':new FormArray([])
    })
  }
roomTypes:any[]=[]
  inputForm!:FormGroup
  del_room:any=[]

  get sectionControls (){
    return (<FormArray>this.inputForm.get('rooms')).controls
  }

  ngOnInit() {
    this.data.selectedRooms.forEach((item:any)=>{
      this.addroom(item)
    })

    this.getExistedRoomsBasedOnProvideridAndHotelId(this.data.hotelID,this.data.providerId)

  }

  addroom(obj:any=null){


    const rooms= new FormGroup({
      "id":new FormControl( obj?obj.id:0),
      "room_id":new FormControl( obj?obj.room_id:null),
      "flight_id":new FormControl( obj?obj.flight_id:null),
      "price":new FormControl( obj?obj.price:null),
      "chd_n_price":new FormControl( obj?obj.chd_n_price:null),
      "chd_w_price":new FormControl( obj?obj.chd_w_price:null),
      "extra_bed_price":new FormControl( obj?obj.extra_bed_price:null),
      "plus_price":new FormControl( obj?obj.plus_price:null),
      "inf_price":new FormControl( obj?obj.inf_price:null),
      "pin":new FormControl( obj?obj.pin:false),
      "capacity":new FormControl( obj?obj.capacity:false),

    })

    if(rooms){
      (<FormArray>this.inputForm.get('rooms')).push(rooms)

    }




  }

  getExistedRoomsBasedOnProvideridAndHotelId(hotelId:any,providerId:any): void {

    let req ={
      hotel_id:hotelId,
      agency_id:providerId
    }
    // this.isLoading = true;
    this.tourApi.getRooms(req).subscribe((res: any) => {
      if (res.isDone) {
        this.roomTypes=res.data
      } else {
        this.message.custom(res.message);
      }
      // this.isLoading = false;

    }, (error: any) => {
      this.message.error()
      // this.isLoading = false;

    })
  }

  sendData(){

    this.dialogRef.close({rooms:this.inputForm.get('rooms')?.value,hotelID:this.data.hotelID,del_rooms:this.del_room})


  }
  deleteItem(index:any,item:any){


    (<FormArray>this.inputForm.get('rooms')).removeAt(index)

this.del_room.push(item.value.id)


    console.log(this.del_room)


  }

}
