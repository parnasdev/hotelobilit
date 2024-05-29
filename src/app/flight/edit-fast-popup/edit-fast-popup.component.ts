import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { FlightApiService } from '../core/https/flight-api.service';
import { IFlightEditReq, IFlightCategory } from '../core/models/flight.model';

@Component({
  selector: 'prs-edit-fast-popup',
  templateUrl: './edit-fast-popup.component.html',
  styleUrls: ['./edit-fast-popup.component.scss']
})
export class EditFastPopupComponent {
  data: any;
  isDomestic = false;
  showForm = false
  airports:any[] = []
  isLoading = false
  submitLoading = false;
  req: IFlightEditReq = {
    origin_id: 0,
    destination_id: 0,
    airline_id: 0,
    airplane_id: 0,
    description: '',
    adl_price: 0,
    cabin_type: '',
    capacity: 0,
    chd_price: 0,
    date: '',
    flight_number: '',
    inf_price: 0,
    is_close: 0,
    time: '',baggage:'',
    duration:'',
    sync_price:true

  }

  change(){

  }

  constructor(public api: FlightApiService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditFastPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public id: number,
    public fb: FormBuilder,
    public router:Router,
    public route: ActivatedRoute,
    public message: MessageService,
    public error: ErrorsService) {
      error.clear();
     }


  ngOnInit() {
    this.getData();
  }




  getData() {
    this.isLoading = true
    this.api.edit(+this.id).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data
          this.airports = this.data.airports
          this.changeCityType()
          this.setData()
          this.showForm = true

        }
        this.isLoading = false
      }, error: (error: any) => {
        this.error.check(error);
        this.showForm = false
        this.isLoading = false
      }
    })
  }

  setData() {
    this.req = {
      origin_id: this.data.flight.origin_id,
      destination_id: this.data.flight.destination_id,
      airline_id: this.data.flight.airline_id,
      airplane_id: this.data.flight.airplane_id,
      description: this.data.flight.description,
      adl_price: this.data.flight.adl_price,
      cabin_type: this.data.flight.cabin_type,
      capacity: this.data.flight.capacity,
      chd_price: this.data.flight.chd_price,
      date: this.data.flight.date,
      flight_number: this.data.flight.flight_number,
      inf_price: this.data.flight.inf_price,
      is_close: this.data.flight.is_close,
      time: this.data.flight.time,
      baggage: this.data.flight.baggage,
duration: this.data.flight.duration,
      sync_price: this.data.flight.sync_price,
    }
    let itemFiltered= this.data.airports.filter((x:any) => x.id === this.data.flight.destination_id)
    if(itemFiltered.length > 0) {
      this.isDomestic = itemFiltered[0].is_domestic
    }
  }


  getAirlines(item: IFlightCategory) {
    this.req.airline_id = item.id;
  }

  getOriginCity(item: IFlightCategory) {
    this.req.origin_id = item.id;

  }
  getDestCity(item: IFlightCategory) {
    this.req.destination_id = item.id
  }

  getAirplanes(item: IFlightCategory) {
    this.req.airplane_id = item.id
  }
  getTime(time: any) {
    this.req.time = time.hour + ':' + time.minute
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'multiple',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.req.date = result.fromDate.dateEn
      }
    })
  }

  changeCityType() {
    this.airports = []
    this.airports = this.data.airports.filter((x:any) => x.is_domestic === this.isDomestic)

  }

  setChildPrice() {

    // @ts-ignore
    this.req.chd_price = this.req.adl_price

  }
  submit(){
    this.submitLoading = true
    this.api.update(this.req,+this.id).subscribe({
      next: (res: any) => {
        this.submitLoading = false;

        this.message.custom(res.message);
        this.dialogRef.close(true);
      }, error: (error: any) => {
        this.submitLoading = false;
        this.error.check(error);
      }
    })
  }
}
