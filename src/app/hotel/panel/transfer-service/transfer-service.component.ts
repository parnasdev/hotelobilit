import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceApiService } from 'src/app/Core/Https/service-api.service';
import { serviceSetReq } from 'src/app/Core/Models/newServicesDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { UpdateTransferServicePopupComponent } from '../update-transfer-service-popup/update-transfer-service-popup.component';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'prs-transfer-service',
  templateUrl: './transfer-service.component.html',
  styleUrls: ['./transfer-service.component.scss']
})
export class TransferServiceComponent implements OnInit {
  price = 0
  rate = ''
  isLoading = false;
  @Input() hotelId = 0
  @Input() flightId = 0
  @Input() catType = 'hotel'
  airports: any[] = [];
  show = false;
  airportId: number = 0;
  categoryId: number = 0;
  categoryName: string = '';

  airportsSelected: serviceSetReq[] = []
  services: any[] = [];
  rateServices: any[] = [];

  constructor(
    public title: Title,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public api: ServiceApiService,
    public message: MessageService) { }

  ngOnInit(): void {
    this.title.setTitle('انتخاب سرویس | هتل و بلیط')

    this.getData();
    this.getList()
  }

  getData(): void {
    this.isLoading = true;
    let id = this.catType === 'hotel' ? this.hotelId : this.flightId;
    let type = this.catType === 'hotel' ? 'hotel' : 'flight';
    this.api.createServicePage(id, type).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.airports = res.data.airports
        this.services = res.data.tourServices
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

  getAirportName(id: number) {
    return this.airports.find(x => x.id === id)?.name
  }

  getServiceName(id: number) {
    return this.services.find(x => x.id === id)?.name
  }


  getList() {
    let id = this.catType === 'hotel' ? this.hotelId : this.flightId;
    let type = this.catType === 'hotel' ? 'hotel' : 'flight';
    this.api.getServiceList(id, type).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.rateServices = res.data;

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
    this.airportId = event.id;
  }

  getServiceSelected(event: any){
    this.categoryId = event.id;
    this.categoryName = event.name
  }

  submit() {
    let obj: serviceSetReq = {
      airport_id: this.catType === 'hotel' ? this.airportId : null,
      hotel_id: this.catType === 'hotel' ? this.hotelId : null,
      flight_id: this.catType === 'flight' ? this.flightId : null,
      category_id: this.categoryId,
      rate: this.price,
      rate_type: this.rate
    }
    this.api.storeService(obj).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.message.custom(res.message)
        this.getList()

      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }

  remove(id: number) {
    this.api.removeService(id).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.message.custom(res.message)
        this.getList()
      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }

  edit(id: number) {
    const dialog = this.dialog.open(UpdateTransferServicePopupComponent, {
      width: '80%',
      data: {
        obj: this.rateServices.find(v => v.id === id),
        hotel_id: this.hotelId,
        airports: this.airports,
        tourServices: this.services,
        id: id,
        type: this.catType
      }
    })
    dialog.afterClosed().subscribe(result => {
      if(result) {
        this.getList()
      }
      })
    }
  }
