import { Component } from '@angular/core';
import { FlightApiService } from '../core/https/flight-api.service';
import { PublicService } from 'src/app/Core/Services/public.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';

@Component({
  selector: 'prs-composition',
  templateUrl: './composition.component.html',
  styleUrls: ['./composition.component.scss']
})
export class CompositionComponent {
  data: { airlines: any[]; airports: any[] } = {
    airlines: [],
    airports: []
  }


  constructor(public api: FlightApiService,
    public message: MessageService,
    public error: ErrorsService,
    public publicService: PublicService) { }


  ngOnInit() {
    this.getData()
  }

  getData() {
    this.api.createMix().subscribe({
      next: (res: any) => {
        if (res.isDone) {
          this.data = res.data
        } else {
          this.message.custom(res.message)
        }
      }, error: (error: any) => {
        this.error.check(error);
      }
    })
  }
}
