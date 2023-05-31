import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceApiService } from 'src/app/Core/Https/service-api.service';
import { serviceSetReq } from 'src/app/Core/Models/newServicesDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-update-transfer-service-popup',
  templateUrl: './update-transfer-service-popup.component.html',
  styleUrls: ['./update-transfer-service-popup.component.scss']
})
export class UpdateTransferServicePopupComponent {
  airportId: number | null = 0;
  categoryId: number = 0;
  price = 0
  rate = ''
  isLoading = false;
  show = false;
  list: any[] = [];

  constructor(public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public api: ServiceApiService,
    public dialogRef: MatDialogRef<UpdateTransferServicePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      hotel_id: number,
      id: number,
      type: string,
      obj: serviceSetReq,
      airports: any[], 
      tourServices: any[]},
    public dialog: MatDialog,
    public message: MessageService) { }

  ngOnInit(): void {
    this.price = this.data.obj.rate;
    this.rate = this.data.obj.rate_type;
    this.airportId = this.data.obj.airport_id;
  }


  getAirportName(id: number | null) {
    return this.data.airports.find(x => x.id === id).name
  }

  getServiceName(id: number){
    return this.data.tourServices.find(x => x.id === id).name
  }

  getAirportSelected(event: any) {
    this.airportId = event.id;
  }

  getServiceSelected(event: any) {
    this.categoryId = event.id;
  }

  submit() {
    let obj: serviceSetReq = {
      airport_id: this.data.type === 'hotel' ? this.airportId : null,
      hotel_id: this.data.type === 'hotel' ? this.data.hotel_id : null,
      flight_id: this.data.type === 'flight' ? this.data.id : null,
      category_id: this.data.id,
      rate: this.price,
      rate_type: this.rate
    }
    this.api.updateService(this.data.id, obj).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.message.custom(res.message)
        this.dialogRef.close(true)

      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }


}
