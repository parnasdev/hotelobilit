import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceApiService } from 'src/app/Core/Https/service-api.service';
import { serviceSetReq } from 'src/app/Core/Models/newServicesDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-transfer-service',
  templateUrl: './transfer-service.component.html',
  styleUrls: ['./transfer-service.component.scss']
})
export class TransferServiceComponent implements OnInit {

  isLoading = false;
  @Input() hotelId = 0
  airports: any[] = [];
  show = false;

  airportsSelected: serviceSetReq[] = []

  constructor(public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public api: ServiceApiService,
    public message: MessageService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.api.createServicePage(this.hotelId).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.airports = res.data.airports
        this.show = true;
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }

  getAirportSelected(event: any) {
    let obj: serviceSetReq = {
      airport_id: event.id,
      hotel_id: this.hotelId,
      transfer_rate: 0,
      transfer_rate_type: ''
    }
    this.airportsSelected.push(obj)
  }
submit() {
  this.api.storeService(this.airportsSelected).subscribe((res: any) => {
    this.isLoading = false;
    if (res.isDone) {
      this.message.custom(res.message)

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