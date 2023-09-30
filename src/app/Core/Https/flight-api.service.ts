import { Injectable } from '@angular/core';
import { Result } from '../Models/result';
import { HttpClient } from '@angular/common/http';
import { PublicService } from '../Services/public.service';
import { environment } from 'src/environments/environment';
import { SetTransferPageDTO, flightStoreDTO, transferRateListDTO } from '../Models/newTransferDTO';
import { FilterDTO } from 'src/app/transfer-rate/filter-popup/filter-popup.component';

@Injectable({
  providedIn: 'root'
})
export class FlightApiService {

  private serverControllerName = 'panel/';

  constructor(
    public http: HttpClient,
    public publicService: PublicService) {
    this.serverControllerName = environment.BACK_END_IP + this.serverControllerName;
  }

  getTransferRates(pageNum = 1, req: FilterDTO): any {
    let str = `?page=${pageNum}&origin=${req.origin}&destination=${req.destination}&fromDate=${req.fromDate}&toDate=${req.toDate}&q=${req.q}&status=${req.status}&airlineDestination=${req.airlineDestination}&airlineOrigin=${req.airlineOrigin}`;
    const strUrl = this.serverControllerName + `flights` + str;
    return this.http.get<Result<transferRateListDTO[]>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getFlightRatesSet(): any {
    const strUrl = this.serverControllerName + `flights/create`;
    return this.http.get<Result<SetTransferPageDTO>>(strUrl, this.publicService.getDefaultHeaders());
  }

  flightChangeStatus(isClose: any, flight_id: number) {
    const strUrl = this.serverControllerName + `flights/change/${flight_id}`;
    const entity = {
      is_close: isClose
    }
    return this.http.patch<Result<SetTransferPageDTO>>(strUrl,entity, this.publicService.getDefaultHeaders());
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

  removeDataFlight(flight_id: number): any {
    const strUrl = this.serverControllerName + `flights/${flight_id}`;
    return this.http.delete<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

}
