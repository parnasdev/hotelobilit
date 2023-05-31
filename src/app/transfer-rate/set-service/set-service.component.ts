import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { FlightApiService } from 'src/app/Core/Https/flight-api.service';
import { TransferRateAPIService } from 'src/app/Core/Https/transfer-rate-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-set-service',
  templateUrl: './set-service.component.html',
  styleUrls: ['./set-service.component.scss']
})
export class SetServiceComponent {

  flight_id = '';

  constructor(public message: MessageService,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public calenderServices: CalenderServices,
    public errorService: ErrorsService,
    public cityApi: CityApiService,
    public checkError: ErrorsService,
    public transferRateApi: TransferRateAPIService,
    public flightApi: FlightApiService) {
  }

  ngOnInit(): void {
    this.flight_id = this.route.snapshot.paramMap.get('id') ?? ''
  }

}
