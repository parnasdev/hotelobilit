import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'prs-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<RoomsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.inputForm=new FormGroup({
      'rooms':new FormArray([])
    })
  }

  inputForm!:FormGroup

  get sectionControls (){
    return (<FormArray>this.inputForm.get('rooms')).controls
  }

  ngOnInit() {
    this.data.selectedRooms.forEach((item:any)=>{
      this.addroom(item)
    })
  }

  addroom(obj:any=null){

    const rooms= new FormGroup({
      "id":new FormControl( obj?obj.id:null),
      "price":new FormControl( obj?obj.price:null),
      "pin":new FormControl( obj?obj.pin:false),

    })

    if(rooms){
      (<FormArray>this.inputForm.get('rooms')).push(rooms)

    }




  }


  sendData(){

    this.dialogRef.close({rooms:this.inputForm.get('rooms')?.value,hotelID:this.data.hotelID})


  }
  deleteItem(index:any){

    (<FormArray>this.inputForm.get('rooms')).removeAt(index)




  }

}
