import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmPriceReqDTO} from "../../hotel/panel/confirm-pricing-modal/confirm-pricing-modal.component";
import {ReserveApiService} from "../../Core/Https/reserve-api.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-reportlog-modal',
  templateUrl: './reportlog-modal.component.html',
  styleUrls: ['./reportlog-modal.component.scss']
})
export class ReportlogModalComponent implements OnInit{
  isSubmiting: boolean=false;
description:string=''
  constructor(public dialogRef: MatDialogRef<ReportlogModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,    public api: ReserveApiService,
              public message: MessageService
  ) {
  }
list:any[]=[]

  propertyList:any[]=[];
  activateDet:any=''
  getLogs(): void {
    // this.isLoading = true;
    this.list = [];
    this.api.getLogs(this.data.reportId).subscribe((res: any) => {
      if (res.isDone) {
        // console.log(res.data);
        this.list=res.data

        console.log(this.list)
      } else {
        // this.message.custom(res.message);
      }
      // this.isLoading = false;
    }, (error: any) => {
      // this.isLoading = false;
      // this.message.error();
      // this.checkErrorService.check(error);
    });
  }




  moredetails(properties:any,index:any){
    this.activateDet=index
    this.propertyList=[]
    for (const property in properties.attributes) {
      if(properties.old){

        this.propertyList.push({title:property,attribute: properties.attributes[property], old:properties.old[property]});
      }else{
        this.propertyList.push({title:property, attribute:properties.attributes[property]});
      }
    }


    console.log(this.propertyList)

  }
  submit(){

let req:any={
  description:this.description
}
if (this.isSubmiting){
  this.message.custom('لطفا منتظر بمانید...');

  return
}else{
  this.isSubmiting = true;
  this.api.addDescription(req,this.data.reportId).subscribe((res: any) => {
    if (res.isDone) {
      // console.log(res.data);
      // this.list=res.data
      this.getLogs()
      this.message.custom('یادداشت ثبت شد');
      this.isSubmiting = false;






      // console.log(this.list)
    } else {
      this.isSubmiting = false;
      this.message.custom(res.message);
    }
    // this.isLoading = false;
  }, (error: any) => {
    // this.isLoading = false;
    // this.message.error();
    this.isSubmiting=false
    // this.checkErrorService.check(error);
  });
}

  }
  ngOnInit() {
this.getLogs()
  }

}
