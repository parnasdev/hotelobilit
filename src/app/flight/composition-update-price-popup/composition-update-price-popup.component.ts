import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightApiService } from '../core/https/flight-api.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';

@Component({
  selector: 'prs-composition-update-price-popup',
  templateUrl: './composition-update-price-popup.component.html',
  styleUrls: ['./composition-update-price-popup.component.scss']
})
export class CompositionUpdatePricePopupComponent {


  req: any = {
    total_adl_price: 0,
    total_chd_price: 0,
    checkin_tomorrow: false,
    checkout_yesterday: false
  }
  constructor(public dialogRef: MatDialogRef<CompositionUpdatePricePopupComponent>,
    public api: FlightApiService,
    public message: MessageService,
    public error: ErrorsService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
      this.req = {
        total_adl_price: data.total_adl_price,
        total_chd_price: data.total_chd_price,
        checkin_tomorrow: data.checkin_tomorrow,
        checkout_yesterday: data.checkout_yesterday
      }

  }


  submit() {
    this.api.updateMix(this.data.id, this.req).subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.dialogRef.close(true);
        }
      }, error: (error: any) => {
        this.error.check(error);
      }
    })
  }
}
