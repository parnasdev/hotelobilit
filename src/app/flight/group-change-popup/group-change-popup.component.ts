import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CityListRes } from 'src/app/Core/Models/newCityDTO';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
import { FlightApiService } from '../core/https/flight-api.service';
import { IFlightCategory, IUpdateBulk } from '../core/models/flight.model';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';

@Component({
  selector: 'prs-group-change-popup',
  templateUrl: './group-change-popup.component.html',
  styleUrls: ['./group-change-popup.component.scss']
})
export class GroupChangePopupComponent {
  req: IUpdateBulk = {
    ids: [],
    origin_id: 0,
    destination_id: 0,
    airline_id: 0,
    date: '',
    time: '',
    flight_number: 0,
    adl_price: 0,
    chd_price: 0,
    inf_price: 0,
    capacity: 0,
    is_close: 0,
    description: '',
    airplane_id: 0,
    cabin_type: "",
    sync_price:true

  }
  constructor(public dialogRef: MatDialogRef<GroupChangePopupComponent>,
    public api: FlightApiService,
    public error: ErrorsService,
    public message: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {

  }


  getItemsChecked() {
    let list: any[] = []
    this.data.items.forEach((element: any) => {
      list.push(element.id)
    });
    return list
  }
  removeEmpty(obj: any) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => (v != null && v !== '' && v !== 0)));
  }
  submit() {
    this.req.ids = this.getItemsChecked()
    this.req = this.removeEmpty(this.req)
    this.api.bulkUpdate(this.req).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.message.custom(res.message);
          this.dialogRef.close(true);
        }
      }, error: (error: any) => {
        this.error.check(error)
      }

    })
  }
 change(){}

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
        type: 'single',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.req.date = res.fromDate.dateEn
        // this.toDate = res.toDate.dateEn;
      }
    })
  }
}
