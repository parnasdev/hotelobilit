import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmPriceReqDTO} from "../../hotel/panel/confirm-pricing-modal/confirm-pricing-modal.component";
import {ReserveApiService} from "../../Core/Https/reserve-api.service";

@Component({
  selector: 'prs-reportlog-modal',
  templateUrl: './reportlog-modal.component.html',
  styleUrls: ['./reportlog-modal.component.scss']
})
export class ReportlogModalComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<ReportlogModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,    public api: ReserveApiService,
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
  ngOnInit() {
this.getLogs()
  }

}
