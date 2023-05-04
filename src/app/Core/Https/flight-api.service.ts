import { Injectable } from '@angular/core';
import { Result } from '../Models/result';
import { HttpClient } from '@angular/common/http';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { SetTransferPageDTO, flightStoreDTO, transferRateListDTO } from '../Models/newTransferDTO';

@Injectable({
  providedIn: 'root'
})
export class FlightApiService {

  private serverControllerName = 'panel/';

  constructor(
    public http: HttpClient,
    public publicService: PublicService) 
    {
      this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
    }

  getTransferRates(): any {
    const strUrl = this.serverControllerName + 'flights';
    return this.http.get<Result<transferRateListDTO[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getFlightRatesSet(): any {
    const strUrl = this.serverControllerName + `flights/create`;
    return this.http.get<Result<SetTransferPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getFlightEditPage(flight_id: number): any {
    const strUrl = this.serverControllerName + `flights/${flight_id}/edit`;
    return this.http.get<Result<SetTransferPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  storeDataFlight(req: flightStoreDTO): any {
    const strUrl = this.serverControllerName + 'flights';
    return this.http.post<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

  UpdateDataFlight(req: flightStoreDTO, flight_id: number): any {
    const strUrl = this.serverControllerName + `flights/${flight_id}`;
    return this.http.patch<Result<any>>(strUrl, req, this.publicService.getDefaultHeaders());
  }

}
